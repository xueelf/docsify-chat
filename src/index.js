import { version } from '../package.json';
import './style.scss';

const classNames = {
  chatPanel: 'chat-panel',
  chatMessage: 'chat-message',
};
const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const regex = {
  chatPanelMarkup: /[\r\n]*(\s*)(<!-+\s+chat:\s*?start\s+-+>)[\r\n]+([\s|\S]*?)[\r\n\s]+(<!-+\s+chat:\s*?end\s+-+>)/m,
  panelTitleMarkup: /[\r\n]*(\s*)<!-+\s+title:\s*(.*)\s+-+>/m,
  chatCommentMarkup: /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+chat:\s*?end\s+-+>)/,
};
const setting = {
  os: isMac ? 'mac' : 'windows',
  title: '聊天记录',
  users: [],
  myself: null,
  animation: 50,
};
const titleBarIcon = {
  mac: {
    close: `
      <svg width="7" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="#000" stroke-width="1.2" stroke-linecap="round" d="M1.182 5.99L5.99 1.182m0 4.95L1.182 1.323">
        </path>
      </svg>
    `,
    minimize: `
      <svg width="6" height="1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="#000" stroke-width="2" stroke-linecap="round" d="M.61.703h5.8"></path>
      </svg>
    `,
    stretch: `
      <svg
        viewBox="0 0 13 13"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke-linejoin="round"
        stroke-miterlimit="2"
      >
        <path d="M4.871 3.553L9.37 8.098V3.553H4.871zm3.134 5.769L3.506 4.777v4.545h4.499z"></path>
        <circle cx="6.438" cy="6.438" r="6.438" fill="none"></circle>
      </svg>
    `,
  },
  windows: {
    close: `
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="512.000000pt"
        height="512.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          <path
            d="M900 4272 c-46 -23 -75 -79 -65 -130 6 -33 98 -129 778 -809 l772 -773 -772 -772 c-849 -851 -807 -802 -767 -885 25 -51 77 -78 129 -69 36 7 110 78 813 779 l772 772 773 -772 c702 -701 776 -772 812 -779 52 -9 104 18 129 69 40 83 82 34 -767 885 l-772 772 772 773 c680 680 772 776 778 809 15 82 -61 158 -143 143 -33 -6 -129 -98 -810 -778 l-772 -772 -768 767 c-428 428 -779 772 -795 777 -39 15 -56 14 -97 -7z" />
        </g>
      </svg>
    `,
    minimize: `
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="512.000000pt"
        height="512.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          <path
            d="M724 2751 c-105 -64 -109 -209 -8 -272 l39 -24 1805 0 1805 0 35 22 c101 63 104 194 6 267 l-27 21 -1812 3 c-1761 2 -1813 1 -1843 -17z" />
        </g>
      </svg>
    `,
    stretch: `
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="512.000000pt"
        height="512.000000pt"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          <path
            d="M1100 4464 c-218 -47 -399 -229 -445 -449 -22 -105 -22 -2805 0 -2910 47 -222 228 -403 450 -450 105 -22 2805 -22 2910 0 222 47 403 228 450 450 22 105 22 2805 0 2910 -47 222 -228 403 -450 450 -102 21 -2815 21 -2915 -1z m2870 -315 c58 -18 130 -78 159 -134 l26 -50 3 -1385 c2 -1001 0 -1396 -9 -1426 -16 -60 -76 -133 -134 -163 l-50 -26 -1405 0 -1405 0 -50 26 c-58 30 -118 103 -134 163 -9 30 -11 425 -9 1426 l3 1385 26 50 c28 53 100 116 153 133 46 15 2776 16 2826 1z" />
        </g>
      </svg>
    `,
  },
};

/**
 * 字符串转换 color 十六进制
 *
 * @param {string} str - 字符
 * @returns 十六进制
 */
function stringToColor(str) {
  let hash = 0;
  let color = '#';

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
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
 * @param {string} title - 标题
 * @returns HTML 结构体
 */
function generateTitleBar(title) {
  let os = setting.os;
  let chatControls = '';

  switch (os) {
    case 'mac':
      chatControls = `
        <button class="circle close">${titleBarIcon[os].close}</button>
        <button class="circle minimize">${titleBarIcon[os].minimize}</button>
        <button class="circle stretch"> ${titleBarIcon[os].stretch}</button>
      `;
      break;
    case 'windows':
      chatControls = `
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
    <header class="titlebar ${os}">
      <div class="controls">${chatControls}</div>
      <span class="title">${title}</span>
    </header>
  `;
}

/**
 * 生成头像结构体
 *
 * @param {string} nickname - 昵称
 * @returns HTML 结构体
 */
function generateAvatar(nickname) {
  const color = stringToColor(nickname);
  const firstChar = nickname.substring(0, 1);
  const userAvatar = `<div class="avatar" style="background-color: ${color};">${firstChar}</div>`;

  return userAvatar;
}

/**
 * 将 markdown 图片文本转换为 html img 标签
 *
 * @param {string} markdown - 文本内容
 * @returns 转换后的文本
 */
function markdownToImageTag(markdown) {
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const imgTag = '<img class="chat-image" src="$2" alt="$1" />';
  const text = markdown.replace(regex, imgTag);

  return text;
}

function renderChat(content, vm) {
  let chatPanelMatch;
  let chatMatch;

  while (chatPanelMatch = regex.chatPanelMarkup.exec(content)) {
    let chatPanel = chatPanelMatch[0];
    let panelTitle = setting.title;
    let chatStartReplacement = '';
    let chatEndReplacement = '';

    const hasTitle = regex.panelTitleMarkup.test(chatPanel);
    const hasComments = regex.chatCommentMarkup.test(chatPanel);
    const chatPanelStart = chatPanelMatch[2];
    const chatPanelEnd = chatPanelMatch[4];

    if (hasTitle) {
      const TitleMatch = regex.panelTitleMarkup.exec(chatPanel);

      panelTitle = TitleMatch[2];
      chatPanel = chatPanel.replace(regex.panelTitleMarkup, '');
    }
    const chatTitlebar = generateTitleBar(panelTitle);

    if (hasComments) {
      chatStartReplacement = `<section class="${classNames.chatPanel}">${chatTitlebar}<main class="main-area">`;
      chatEndReplacement = `</main></section>`;

      while (chatMatch = regex.chatCommentMarkup.exec(chatPanel)) {
        const nickname = chatMatch[2];
        const message = markdownToImageTag(chatMatch[3].trim());
        const user = setting.users.filter(item => item.nickname === nickname)[0] ?? {};
        const is_me = setting.myself === nickname;
        const userAvatar = user.avatar
          ? `<div class="avatar"><img src="${user.avatar}"></div>`
          : generateAvatar(nickname);
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
        const chatContent = chatContentTemplate.replace(avatarPosition[0], userAvatar).replace(avatarPosition[1], '');

        chatPanel = chatPanel.replace(chatMatch[0], chatContent);
      }
    }
    chatPanel = chatPanel.replace(chatPanelStart, chatStartReplacement);
    chatPanel = chatPanel.replace(chatPanelEnd, chatEndReplacement);
    content = content.replace(chatPanelMatch[0], chatPanel);
  }
  return content;
}

function createResizeObserver() {
  return new ResizeObserver(entries => {
    entries.forEach(({ target }) => {
      const chatImageElements = target.querySelectorAll('.chat-image');

      for (const element of chatImageElements) {
        element.style.maxWidth = `calc(${target.offsetWidth / 2}px - 6.5rem)`;
      }
    });
  });
}

function createIntersectionObserver() {
  return new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      const chatMessageElements = target.getElementsByClassName(classNames.chatMessage);

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

function docsifyChat(hook, vm) {
  let has_chat = false;
  const resizeObserver = createResizeObserver();
  const intersectionObserver = createIntersectionObserver();

  hook.beforeEach(content => {
    has_chat = regex.chatPanelMarkup.test(content);

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
    const chatPanelElements = document.getElementsByClassName(classNames.chatPanel);

    for (const element of chatPanelElements) {
      resizeObserver.observe(element);
      intersectionObserver.observe(element);
    }
  });
}

if (window) {
  window.$docsify ??= {};
  window.$docsify.chat ??= {};
  window.$docsify.plugins ??= [];

  for (const key in window.$docsify.chat) {
    if (Object.prototype.hasOwnProperty.call(setting, key)) {
      setting[key] = window.$docsify.chat[key];
    }
  }
  window.$docsify.chat.version = version;
  window.$docsify.plugins = [docsifyChat, ...window.$docsify.plugins];
}
