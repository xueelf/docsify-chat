import { version } from '../package.json';
import './style.scss';

const classNames = {
  chatPanel: 'chat-panel',
  chatControls: 'controls',
  chatMessage: 'chat-message',
};
const regex = {
  chatPanelMarkup: /[\r\n]*(\s*)(<!-+\s+chat:\s*?start\s+-+>)[\r\n]+([\s|\S]*?)[\r\n\s]+(<!-+\s+chat:\s*?end\s+-+>)/m,
  chatCommentMarkup: /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+chat:\s*?end\s+-+>)/
};
const setting = {
  title: '聊天记录',
  users: [],
};

function stringToColour(str) {
  let hash = 0;
  let colour = '#';

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function generateAvatar(nickname) {
  const colour = stringToColour(nickname);
  const firstChar = nickname.substring(0, 1);
  const userAvatar = `<div class="avatar" style="background-color: ${colour};">${firstChar}</div>`;

  return userAvatar;
}

function renderChat(content, vm) {
  let chatPanelMatch;
  let chatMatch;

  while (chatPanelMatch = regex.chatPanelMarkup.exec(content)) {
    let chatPanel = chatPanelMatch[0];
    let chatStartReplacement = '';
    let chatEndReplacement = '';

    const hasComments = regex.chatCommentMarkup.test(chatPanel);
    const chatPanelStart = chatPanelMatch[2];
    const chatPanelEnd = chatPanelMatch[4];
    const chatControls = `
      <div class="${classNames.chatControls}">
        <div class="circle red"></div>
        <div class="circle yellow"></div>
        <div class="circle green"></div>
        <div class="title">${setting.title}</div>
      </div>
    `;

    if (hasComments) {
      chatStartReplacement = `<div class="${classNames.chatPanel}">${chatControls}`;
      chatEndReplacement = `</div>`;

      while (chatMatch = regex.chatCommentMarkup.exec(chatPanel)) {
        const nickname = chatMatch[2];
        const message = chatMatch[3].trim();
        const user = setting.users.filter(item => item.nickname === nickname)[0] ?? {};
        const userAvatar = user.avatar
          ? `<div class="avatar"><img src="${user.avatar}"></div>`
          : generateAvatar(nickname);

        chatPanel = chatPanel.replace(chatMatch[0], `
          <div class="chat-content">
            <div class="chat-message">
              ${userAvatar}
              <div class="message-box">
                <div class="nickname">${nickname}</div>
                <div class="message">${message}</div>
              </div>
            </div>
          </div>
        `)
      }
    }
    chatPanel = chatPanel.replace(chatPanelStart, chatStartReplacement);
    chatPanel = chatPanel.replace(chatPanelEnd, chatEndReplacement);
    content = content.replace(chatPanelMatch[0], chatPanel);
  }
  return content;
}

function docsifyChat(hook, vm) {
  let hasChat = false;

  hook.beforeEach(content => {
    hasChat = regex.chatPanelMarkup.test(content);

    if (hasChat) {
      content = renderChat(content, vm);
    }
    return content;
  });

  hook.mounted(() => {
    const chat_panel = document.getElementsByClassName(classNames.chatPanel);

    document.addEventListener('scroll', () => {
      // 滚动条高度 + 视窗高度 = 可见区域底部高度
      const visibleBottom = window.scrollY + document.documentElement.clientHeight;
      // 可见区域顶部高度
      const visibleTop = window.scrollY;

      for (let i = 0; i < chat_panel.length; i++) {
        const centerY = chat_panel[i].offsetTop + (chat_panel[i].offsetHeight / 2);

        if (centerY > visibleTop && centerY < visibleBottom) {
          document
            .querySelectorAll(`.${classNames.chatPanel} .${classNames.chatMessage}`)
            .forEach(element => element.setAttribute("class", 'chat-message show'))
        } else {
          document
            .querySelectorAll(`.${classNames.chatPanel} .${classNames.chatMessage}`)
            .forEach(element => element.setAttribute("class", 'chat-message'))
        }
      }
    });
  });
}

if (window) {
  window.$docsify = window.$docsify ?? {};
  window.$docsify.chat = window.$docsify.chat ?? {};

  Object.keys(window.$docsify.chat).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(setting, key)) {
      setting[key] = window.$docsify.chat[key];
    }
  });

  window.$docsify.chat.version = version;
  window.$docsify.plugins = [].concat(
    docsifyChat,
    (window.$docsify.plugins ?? [])
  );
}
