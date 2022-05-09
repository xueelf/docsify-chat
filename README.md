# docsify-chat

A docsify plugin for generate chat panel from markdown

```markdown
<!-- chat:start -->

#### **yuki**

Do you know 0.1 + 0.2 = ?

#### **kokkoro**

Sure, equal 0.30000000000000004 !

<!-- chat:end -->
```

![nameless](/example/nameless.svg)

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

   八嘎、hentai、无路赛

   #### **yuki**

   多来点

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
      title: '聊天记录',
      users: [
        { nickname: 'yuki', avatar: '' },
        { nickname: 'kokkoro', avatar: '' },
      ],
    }
  };
</script>
```

## Postscript

Because I wrote a chatbot framework, I needed a chat panel for illustrate. before I took screenshots directly in the software, but it felt too troublesome. I was thinking why can't it be generated directly with markdown? I've been looking for a long time, but I can't find any similar plugins, so I made one myself.

In order to save time, the syntax refers to docsify-tabs, which took only half a day to make. Although it basically meets daily use, there may be some unknown bugs.
