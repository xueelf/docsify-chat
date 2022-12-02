# docsify-chat

A docsify plugin for generate chat panel from markdown

Read this in other languages: English | [简体中文](./README.zh.md)

```markdown
<!-- chat:start -->

#### **kokkoro**

八嘎 hentai 无路赛！

#### **yuki**

多来点

<!-- chat:end -->
```

![docsify_chat](https://vip2.loli.io/2022/05/10/9HXngprql6w3tmJ.png)

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

   #### **kokkoro**

   hello

   #### **yuki**

   hello world

   <!-- chat:end -->
   ```

3. Generate and display your chat panel.

   If you do not specify a user avatar, the initials of the nickname will be displayed by default.

   ![demo](/demo.svg)

## Options

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `chat` key:

```html
<script>
  window.$docsify = {
    // ...
    chat: {
      // chat panel title
      title: '聊天记录',
      // set avatar url
      users: [],
      // message dialog on the right (myself)
      myself: 'yuki',
      // animation interval (ms)
      animation: 50,
      // Panel navigation bar style, supporting "mac" and "windows"
      os: 'mac',
    }
  };
</script>
```

### title

- Type: `string`
- Default: `'聊天记录'`

Sets the chat panel title.

You can also set the title for each chat panel individually in `<!-- title:xxx -->`.

**Configuration**

```javascript
window.$docsify = {
  // ...
  chat: {
    title: 'chat history'
  }
};
```

**Example**

```markdown
<!-- chat:start -->

<!-- title:yuki's chat history -->

<!-- chat:end -->
```

### users

- Type: `array`
- Default: `[]`

Specify a nickname to match the user's avatar.

**Configuration**

```javascript
window.$docsify = {
  // ...
  chat: {
    users: [
      { nickname: 'yuki', avatar: 'images/yuki.png' },
      { nickname: 'kokkoro', avatar: 'images/kokkoro.png' },
    ]
  }
};
```

### myself

- Type: `string`
- Default: `null`

Set your own global nickname, the dialog will be displayed on the right side of the chat panel.

**Configuration**

```javascript
window.$docsify = {
  // ...
  chat: {
    myself: 'yuki'
  }
};
```

### animation

- Type: `number`
- Default: `50`

Adjust the duration of the chat panel fade-in and fade-out animation.

**Configuration**

```javascript
window.$docsify = {
  // ...
  chat: {
    animation: 50
  }
};
```

### os

- Type: `string`
- Default: `null`

Define the system style of the titlebar, support "mac" and "windows".

If it is not set, it will be based on the current browser ` navigator Platform ` Automatic rendering.

**Configuration**

```javascript
window.$docsify = {
  // ...
  chat: {
    os: 'mac',
  }
};
```

## Postscript

Because I wrote a chatbot framework, I needed a chat panel for illustrate. before I took screenshots directly in the software, but it felt too troublesome. I was thinking why can't it be generated directly with markdown? I've been looking for a long time, but I can't find any similar plugins, so I made one myself.

In order to save time, the syntax refers to [docsify-tabs](https://github.com/jhildenbiddle/docsify-tabs), which took only half a day to make. Although it basically meets daily use, there may be some unknown bugs.
