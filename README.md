# docsify-chat

A docsify plugin for generate chat panel from markdown

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

3. A chat panel.

   ![demo](https://vip1.loli.io/2022/05/08/Dnh2vqFK97ya13o.png)

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
