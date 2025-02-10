# docsify-chat

一个基于 docsify 的插件，可在 markdown 中生成聊天对话

使用其他语言阅读：[English](./README.md) | 简体中文

```markdown
<!-- chat:start -->

#### **Yuki**

Hello

#### **Robot**

Ciallo ～(∠·ω< )⌒★

<!-- chat:end -->
```

![docsify_chat](https://cdn.sa.net/2024/12/09/cI9ewyEFLNG6roZ.png)

## 安装

1. 在 `index.html` 中添加 docsify-chat，必须在 docsify 之后引入。

   ```html
   <!-- Docsify -->
   <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>

   <!-- Docsify Chat -->
   <script src="//cdn.jsdelivr.net/npm/docsify-chat/lib/docsify-chat.min.js"></script>
   ```

2. 可以在 [配置项](#配置项) 中根据自身需要来进行相关配置。

   ```javascript
   window.$docsify = {
     // ...
     chat: {
       // 聊天面板标题
       title: "窗口",
       // 设置头像
       users: [
         { nickname: "Yuki", avatar: "" },
         { nickname: "Robot", avatar: "" },
       ],
     },
   };
   ```

## 使用

1. 使用 `chat:start` 与 `chat:end` 的 HTML 注释来定义聊天面板。

   HTML 注释用于标记聊天面板的开始和结束。

   ```markdown
   <!-- chat:start -->

   ...

   <!-- chat:end -->
   ```

2. 使用标题 + 粗体标记在聊天面板中定义消息。

   标题文本将被用作用户昵称，后续所有内容都将视为对话框内容，直到下一个标题或 `chat:end` 标记结束。

   ```markdown
   <!-- chat:start -->

   #### **Yuki**

   hello

   #### **Robot**

   hello world

   <!-- chat:end -->
   ```

3. 若上述步骤无误，页面将会生成并显示聊天面板。

   如果未指定用户头像，则默认情况下将显示昵称的首字母。

   ![example](/example.svg)

## 配置项

相关配置可以在 [`window.$docsify`](https://docsify.js.org/#/configuration) 下的 `chat` 字段中定义：

```html
<script>
  window.$docsify = {
    // ...
    chat: {
      // 聊天面板标题
      title: "Robot的聊天记录",
      // 设置头像
      users: [],
      // 在右侧显示消息（自己发出的）
      self: "Yuki",
      // 动画延时 （毫秒）
      animation: 50,
      // 面板导航栏风格，支持 "mac" 与 "windows"
      os: "mac",
    },
  };
</script>
```

### title

- 类型: `string`
- 默认: `'Dialog'`

设置聊天面板的全局标题。

你还可以在 `<!-- title:xxx -->` 中分别为每个聊天面板单独设置标题。

**配置**

```javascript
window.$docsify = {
  // ...
  chat: {
    title: '聊天记录',
  },
};
```

**语法**

```markdown
<!-- chat:start -->

<!-- title:与 Yuki 的聊天记录 -->

<!-- chat:end -->
```

### users

- 类型: `array`
- 默认: `[]`

设置用户的头像与昵称，支持网络地址。

**配置**

```javascript
window.$docsify = {
  // ...
  chat: {
    users: [
      { nickname: 'Yuki', avatar: 'images/yuki.png' },
      { nickname: 'Robot', avatar: 'images/robot.png' },
    ],
  },
};
```

### self

> 在 v0.5.0 以前，该属性名为 `"myself"`，现已更名为 `"self"`。

- 类型: `string`
- 默认: `null`

定义一个昵称，该用户的对话框将显示在聊天面板的右侧。

你还可以在 `<!-- self:xxx -->` 中分别为每个聊天面板单独设置用户。

**配置**

```javascript
window.$docsify = {
  // ...
  chat: {
    self: 'Yuki',
  },
};
```

**语法**

```markdown
<!-- chat:start -->

<!-- self:Robot -->

<!-- chat:end -->
```

### animation

- 类型: `number`
- 默认: `50`

调整聊天对话框淡入淡出的动画时长。

**设置**

```javascript
window.$docsify = {
  // ...
  chat: {
    animation: 50,
  },
};
```

### os

- 类型: `string`
- 默认: `null`

定义标题栏的系统风格，支持 `"mac"` 与 `"windows"`。

如果不设置，将会根据当前浏览器 `navigator.platform` 自动渲染。

**设置**

```javascript
window.$docsify = {
  // ...
  chat: {
    os: 'mac',
  },
};
```

## 补充

因为我写了一个 QQ 机器人框架，所以需要一个聊天面板在文档中做相关演示。在这之前我是直接在 QQ 里截图后丢到文档的，但这样感觉太麻烦了。突发奇想为什么不能直接用 markdown 来生成咧？但是我找了很长时间，都没有类似的插件，所以就自己做了一个。

为了节省时间，相关语法完全参照 [docsify-tabs](https://github.com/jhildenbiddle/docsify-tabs)，只花了半天时间就做好了。虽然它基本满足日常使用，但可能会存在一些未知的 bug。
