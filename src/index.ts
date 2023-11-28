import { version } from 'package.json';
import '@/styles/index.scss';

import macClose from '@/icons//mac/close.svg';
import macMinimize from '@/icons/mac/minimize.svg';
import macStretch from '@/icons/mac/stretch.svg';
import windowsClose from '@/icons/windows/close.svg';
import windowsMinimize from '@/icons/windows/minimize.svg';
import windowsStretch from '@/icons/windows/stretch.svg';

export interface User {
  avatar?: string;
  nickname: string;
}

export interface DocsifyChatSetting {
  [key: string]: unknown;
  animation: number;
  myself: string | null;
  os: 'mac' | 'windows';
  title: string;
  users: User[];
  version: string;
}

enum ClassName {
  ChatImage = 'chat-image',
  ChatMessage = 'chat-message',
  ChatPanel = 'chat-panel',
}

const IS_MAC = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const CHAT_PANEL_MARKUP =
  /( *)(<!-+\s+chat:\s*?start\s+-+>)(?:(?!(<!-+\s+chat:\s*?(?:start|end)\s+-+>))[\s\S])*(<!-+\s+chat:\s*?end\s+-+>)/;
const CHAT_TITLE_MARKUP = /[\r\n]*(\s*)<!-+\s+title:\s*(.*)\s+-+>/;
const CHAT_MESSAGE_MARKUP =
  /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+chat:\s*?end\s+-+>)/m;

const setting: DocsifyChatSetting = {
  animation: 50,
  myself: null,
  os: IS_MAC ? 'mac' : 'windows',
  title: '聊天记录',
  users: [],
  version,
};
const titleBarIcon = {
  mac: {
    close: macClose,
    minimize: macMinimize,
    stretch: macStretch,
  },
  windows: {
    close: windowsClose,
    minimize: windowsMinimize,
    stretch: windowsStretch,
  },
};

/**
 * 字符串转换 color 十六进制
 *
 * @param string - 字符
 * @returns 十六进制
 */
function stringToColor(string: string) {
  let hash = 0;
  let color = '#';

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

/**
 * 生成标题栏结构体
 *
 * @param title - 标题
 * @returns HTML 结构体
 */
function generateTitleBar(title: string) {
  let os = setting.os;
  let controls = '';

  switch (os) {
    case 'mac':
      controls = `
        <button class="circle close">${titleBarIcon[os].close}</button>
        <button class="circle minimize">${titleBarIcon[os].minimize}</button>
        <button class="circle stretch"> ${titleBarIcon[os].stretch}</button>
      `;
      break;
    case 'windows':
      controls = `
        <button class="minimize">${titleBarIcon[os].minimize}</button>
        <button class="stretch"> ${titleBarIcon[os].stretch}</button>
        <button class="close">${titleBarIcon[os].close}</button>
      `;
      break;
    default:
      console.error(`os "${os}" is invalid argument`);
      break;
  }

  return `
    <header class="title-bar ${os}">
      <div class="controls">${controls}</div>
      <span class="title">${title}</span>
    </header>
  `;
}

/**
 * 生成头像结构体
 *
 * @param user - 用户信息
 * @returns HTML 结构体
 */
function generateAvatar(user: User) {
  const { avatar, nickname } = user;

  if (avatar) {
    return `<div class="avatar"><img src="${avatar}"></div>`;
  } else {
    const color = stringToColor(nickname);
    const first_char = nickname.substring(0, 1);

    return `<div class="avatar" style="background-color: ${color};">${first_char}</div>`;
  }
}

/**
 * 生成消息结构体
 *
 * @param markdown - 原始文本内容
 * @returns HTML 结构体
 */
function generateMessage(content: string) {
  const regex = /!\[(.*?)\]\((.*?)\)/;
  const segments = content.trim().split('\n');
  const message = segments.map(segment => {
    const is_image = regex.test(segment);

    if (is_image) {
      const image = '<img class="chat-image" src="$2" alt="$1" />';
      return segment.replace(regex, image);
    } else {
      const text = `<div class="chat-text">${segment}</div>`;
      return segment.replace(segment, text);
    }
  });

  return message.join('\n');
}

function renderChat(content: string, vm: Docsify) {
  let chatExecs;
  let messageExecs;

  while ((chatExecs = CHAT_PANEL_MARKUP.exec(content))) {
    let raw_chat = chatExecs[0];
    let title = setting.title;
    let chat_start_replacement = '';
    let chat_end_replacement = '';

    const has_title = CHAT_TITLE_MARKUP.test(raw_chat);
    const has_message = CHAT_MESSAGE_MARKUP.test(raw_chat);

    if (has_title) {
      const titleExecs = CHAT_TITLE_MARKUP.exec(raw_chat)!;

      title = titleExecs[2];
      raw_chat = raw_chat.replace(CHAT_TITLE_MARKUP, '');
    }
    const chat_title_bar = generateTitleBar(title);

    if (has_message) {
      chat_start_replacement = `<section class="${ClassName.ChatPanel}">${chat_title_bar}<main class="main-area">`;
      chat_end_replacement = `</main></section>`;

      while ((messageExecs = CHAT_MESSAGE_MARKUP.exec(raw_chat))) {
        const nickname = messageExecs[2];
        const message = generateMessage(messageExecs[3]);
        const user = setting.users.find(item => item.nickname === nickname) ?? {
          nickname,
        };
        const is_me = setting.myself === nickname;
        const avatar = generateAvatar(user);
        const chatContentTemplate = `
          <div class="chat-message ${!is_me ? '' : 'myself'}">
            $1
            <div class="message-box">
              <div class="nickname">${nickname}</div>
              <div class="message">${message}</div>
            </div>
            $2
          </div>
        `;
        const avatarPosition = !is_me ? ['$1', '$2'] : ['$2', '$1'];
        const chatContent = chatContentTemplate.replace(avatarPosition[0], avatar).replace(avatarPosition[1], '');

        raw_chat = raw_chat.replace(messageExecs[0], chatContent);
      }
    }
    const chat_start = chatExecs[2];
    const chat_end = chatExecs[4];

    raw_chat = raw_chat.replace(chat_start, chat_start_replacement);
    raw_chat = raw_chat.replace(chat_end, chat_end_replacement);
    raw_chat = raw_chat.replace(/(\s{2,}|\n)/g, '');
    content = content.replace(chatExecs[0], raw_chat);
  }
  return content;
}

function createResizeObserver() {
  return new ResizeObserver(entries => {
    entries.forEach(entry => {
      const { target } = entry;
      const { offsetWidth } = <HTMLDivElement>target;
      const chatImageElements = target.getElementsByClassName(ClassName.ChatImage);

      for (let i = 0; i < chatImageElements.length; i++) {
        const element = <HTMLDivElement>chatImageElements[i];
        element.style.maxWidth = `calc((${offsetWidth}px - 5rem) / 2)`;
      }
    });
  });
}

function createIntersectionObserver() {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const { target, isIntersecting } = entry;
      const chatMessageElements = target.getElementsByClassName(ClassName.ChatMessage);

      for (let i = 0; i < chatMessageElements.length; i++) {
        const element = chatMessageElements[i];

        if (isIntersecting) {
          setTimeout(() => element.classList.add('show'), i * setting.animation);
        } else {
          // TODO: ／人◕ ‿‿ ◕人＼ clearTimeout
          element.classList.remove('show');
        }
      }
    });
  });
}

function docsifyChat(hook: DocsifyHook, vm: Docsify) {
  let has_chat: boolean;

  const resizeObserver = createResizeObserver();
  const intersectionObserver = createIntersectionObserver();

  hook.beforeEach(content => {
    has_chat = CHAT_PANEL_MARKUP.test(content);

    if (has_chat) {
      content = renderChat(content, vm);
    }
    return content;
  });

  hook.doneEach(() => {
    resizeObserver.disconnect();
    intersectionObserver.disconnect();

    if (!has_chat) {
      return;
    }
    const chatPanelElements = document.getElementsByClassName(ClassName.ChatPanel);

    for (let i = 0; i < chatPanelElements.length; i++) {
      const element = chatPanelElements[i];

      resizeObserver.observe(element);
      intersectionObserver.observe(element);
    }
  });
}

if (window) {
  window.$docsify ??= {};
  window.$docsify.chat ??= {};

  for (const key in window.$docsify.chat) {
    if (Object.prototype.hasOwnProperty.call(setting, key)) {
      setting[key] = window.$docsify.chat[key];
    }
  }
  window.$docsify.plugins ??= [];
  window.$docsify.plugins = [docsifyChat, ...window.$docsify.plugins];
}
