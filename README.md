# docsify-chat

A docsify plugin for generate chat panel from markdown

![demo](https://vip2.loli.io/2022/05/09/cC1HmVvPe9jQLpk.jpg)

## Installation

1. Add the docsify-chat plugin to your `index.html` after docsify.

   ```html
   <!-- Docsify -->
   <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>

   <!-- Docsify Chat -->
   <script src="//cdn.jsdelivr.net/npm/docsify-chat/lib/docsify-chat.min.js"></script>
   ```

2. Review the [Options](#options) section and configure as needed.

   ```javascript
   window.$docsify = {
     // ...
     chat: {
       // chat panel title
       title: '聊天记录',
       // set avatar url
       users: [
         { nickname: 'yuki', avatar: '' },
         { nickname: 'kokkoro', avatar: '' },
       ],
     }
   };
   ```

## Usage

1. Define a chat set using `chat:start` and `chat:end` HTML comments.

   HTML comments are used to mark the start and end of a chat set.

   ```markdown
   <!-- chat:start -->

   ...

   <!-- chat:end -->
   ```

2. Define chat within a message set using heading + bold markdown.

   Heading text will be used as the user nickname, and all proceeding content will be associated with that chat up to start of the next message or a `chat:end` comment.

   ```markdown
   <!-- chat:start -->

   #### **yuki**

   hello

   #### **kokkoro**

   hello world

   <!-- chat:end -->
   ```

3. Generate and display your chat panel.

   If you do not specify a user avatar, the initials of the nickname will be displayed by default.

   <div class="chat-panel">
    <div class="controls">
      <div class="circle red"></div>
      <div class="circle yellow"></div>
      <div class="circle green"></div>
      <div class="title">聊天记录</div>
    </div>
    <div class="chat-content">
      <div class="chat-message show">
        <div class="avatar" style="background-color: #7ac538;">y</div>
        <div class="message-box">
          <div class="nickname">yuki</div>
          <div class="message">print hello world</div>
        </div>
      </div>
    </div>
    <div class="chat-content">
      <div class="chat-message show">
        <div class="avatar" style="background-color: #a8d6ba;">k</div>
        <div class="message-box">
          <div class="nickname">kokkoro</div>
          <div class="message">hello world</div>
        </div>
      </div>
    </div>
   </div>

## Options

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `chat` key:

```html
<script>
  window.$docsify = {
    // ...
    chat: {
      title: '聊天记录',
      users: [
        { nickname: 'yuki', avatar: '' },
        { nickname: 'kokkoro', avatar: '' },
      ],
    }
  };
</script>
```

<style>
.chat-panel {
  position: relative;
  border-radius: 0.5rem;
  margin: 1rem auto;
  padding: 0.3rem 0;
  background-color: #00000005;
  overflow-x: auto;
}

.chat-panel .controls {
  display: initial;
  width: 100%;
  padding: 0.5rem;
}

.chat-panel .controls .circle {
  display: inline-block;
  margin: 0.5rem 0rem 0.5rem 0.2rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}

.chat-panel .controls .red {
  background-color: #ff5f56;
}

.chat-panel .controls .yellow {
  background-color: #ffbd2e;
}

.chat-panel .controls .green {
  background-color: #27c93f;
}

.chat-panel .controls .title {
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 0.8rem;
  line-height: 1rem;
  top: 0.8rem;
}

.chat-panel .chat-content {
  padding: 0 1rem;
}

.chat-panel .chat-message {
  position: relative;
  margin: 1rem 0;
  opacity: 0;
  transform: translate(-10%);
  transition: transform 0.4s ease-out, opacity 0.4s ease-in;
}

.chat-panel .chat-message .avatar {
  width: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  border-radius: 50%;
  line-height: 2.5rem;
  color: #fff;
  text-align: center;
  display: inline-block;
}

.chat-panel .chat-message .avatar img {
  display: inline-flex;
  line-height: 0;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.chat-panel .chat-message .message-box {
  display: inline-block;
  margin-left: 0.5rem;
  max-width: 90%;
  vertical-align: top;
}

.chat-panel .chat-message .message-box .nickname {
  font-size: 0.8rem;
  color: gray;
}

.chat-panel .chat-message .message-box .message {
  position: relative;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  background-color: #fff;
  word-break: break-all;
  padding: 0.6rem 0.7rem;
  margin-top: 0.2rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}

.chat-panel .show {
  opacity: 1;
  transform: translate(0);
}
</style>
