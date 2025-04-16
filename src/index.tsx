import styleContent from '@/styles/index.scss';
import { version } from 'package.json';
import { Message, TitleBar } from '@/components';

const styleElement = document.createElement('style');
styleElement.textContent = styleContent;
document.head.appendChild(styleElement);

enum ClassName {
  ChatImage = 'chat-image',
  ChatMessage = 'chat-message',
  ChatPanel = 'chat-panel',
}

const IS_MAC = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const CHAT_PANEL_MARKUP =
  /( *)(<!-+\s+chat:\s*?start\s+-+>)(?:(?!(<!-+\s+chat:\s*?(?:start|end)\s+-+>))[\s\S])*(<!-+\s+chat:\s*?end\s+-+>)/;
const CHAT_TITLE_MARKUP = /[\r\n]*(\s*)<!-+\s+title:\s*(.*)\s+-+>/;
const CHAT_SELF_MARKUP = /[\r\n]*(\s*)<!-+\s+self:\s*(.*)\s+-+>/;
const CHAT_MESSAGE_MARKUP =
  /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+chat:\s*?end\s+-+>)/m;

const setting: DocsifyChatSetting = {
  animation: 50,
  myself: null,
  self: null,
  os: IS_MAC ? 'mac' : 'windows',
  title: 'Dialog',
  users: [],
  version,
};

/**
 * 解析消息结构体
 *
 * @param markdown - 原始 Markdown 文本
 * @returns HTML 结构体
 */
function parseContent(markdown: string): string {
  const regex = /!\[(.*?)\]\((.*?)\)/;
  const segments = markdown.trim().split('\n');
  const content = segments.map(segment => {
    const is_image = regex.test(segment);

    if (is_image) {
      const image = '<img class="chat-image" src="$2" alt="$1" />';
      return segment.replace(regex, image);
    } else {
      const text = `<div class="chat-text">${segment}</div>`;
      return segment.replace(segment, text);
    }
  });

  return content.join('');
}

function renderChat(content: string, vm: Docsify) {
  let chatExecs;
  let messageExecs;

  while ((chatExecs = CHAT_PANEL_MARKUP.exec(content))) {
    let raw_chat = chatExecs[0];
    let title = setting.title;
    let self = setting.self || setting.myself;
    let chat_start_replacement = '';
    let chat_end_replacement = '';

    const has_title = CHAT_TITLE_MARKUP.test(raw_chat);
    const has_self = CHAT_SELF_MARKUP.test(raw_chat);
    const has_message = CHAT_MESSAGE_MARKUP.test(raw_chat);

    if (has_title) {
      const titleExecs = CHAT_TITLE_MARKUP.exec(raw_chat)!;

      title = titleExecs[2];
      raw_chat = raw_chat.replace(CHAT_TITLE_MARKUP, '');
    }
    const chat_title_bar = <TitleBar title={title} />;

    if (has_self) {
      const selfExecs = CHAT_SELF_MARKUP.exec(raw_chat)!;

      self = selfExecs[2];
      raw_chat = raw_chat.replace(CHAT_SELF_MARKUP, '');
    }

    if (has_message) {
      chat_start_replacement = `<section class="${ClassName.ChatPanel}">${chat_title_bar}<main class="main-area">`;
      chat_end_replacement = `</main></section>`;

      while ((messageExecs = CHAT_MESSAGE_MARKUP.exec(raw_chat))) {
        const nickname = messageExecs[2];
        const content = parseContent(messageExecs[3]);
        const user = setting.users.find(item => item.nickname === nickname) ?? {
          nickname,
        };
        const is_me = self === nickname;

        raw_chat = raw_chat.replace(
          messageExecs[0],
          <Message user={user} content={content} self={is_me} />,
        );
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
      const { offsetWidth } = target as HTMLDivElement;
      const chatImageElements = target.getElementsByClassName(ClassName.ChatImage);

      for (let i = 0; i < chatImageElements.length; i++) {
        const element = chatImageElements[i] as HTMLDivElement;
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
    if (setting.myself) {
      console.warn(
        'The "myself" attribute is about to be abandoned, it is recommended to replace it with "self".',
      );
    }
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

window.$docsify ??= {};
window.$docsify.chat ??= {};
window.$docsify.plugins ??= [];
window.$docsify.plugins.push(docsifyChat);
Object.assign(setting, window.$docsify.chat);
