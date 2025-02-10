import { stringToColor } from '@/util';
import macClose from '@/icons//mac/close.svg';
import macMinimize from '@/icons/mac/minimize.svg';
import macStretch from '@/icons/mac/stretch.svg';
import windowsClose from '@/icons/windows/close.svg';
import windowsMinimize from '@/icons/windows/minimize.svg';
import windowsStretch from '@/icons/windows/stretch.svg';

function MacControls() {
  return (
    <>
      <button class="circle close" dangerouslySetInnerHTML={{ __html: macClose }} />
      <button class="circle minimize" dangerouslySetInnerHTML={{ __html: macMinimize }} />
      <button class="circle stretch" dangerouslySetInnerHTML={{ __html: macStretch }} />
    </>
  );
}

function WindowsControls() {
  return (
    <>
      <button class="minimize" dangerouslySetInnerHTML={{ __html: windowsMinimize }} />
      <button class="stretch" dangerouslySetInnerHTML={{ __html: windowsStretch }} />
      <button class="close" dangerouslySetInnerHTML={{ __html: windowsClose }} />
    </>
  );
}

function Controls() {
  const os = window.$docsify?.chat?.os;

  switch (os) {
    case 'mac':
      return <MacControls />;
    case 'windows':
      return <WindowsControls />;
    default:
      console.error(`os "${os}" is invalid argument`);
  }
}

export function TitleBar(props: { title: string }) {
  const os = window.$docsify?.chat?.os!;

  return (
    <header class={['title-bar', os]}>
      <div class="controls">
        <Controls />
      </div>
      <span class="title">{props.title}</span>
    </header>
  );
}

export function Avatar(props: { user: User }) {
  const { avatar, nickname } = props.user;

  if (avatar) {
    return (
      <div class={avatar}>
        <img src={avatar} />
      </div>
    );
  } else {
    const color = stringToColor(nickname);
    const first_char = nickname.substring(0, 1);

    return (
      <div
        class="avatar"
        style={{
          backgroundColor: color,
        }}
      >
        <span>{first_char}</span>
      </div>
    );
  }
}

export function Message(props: { user: User; content: string; self: boolean }) {
  const { user, content, self } = props;

  return (
    <div class={{ 'chat-message': true, self }}>
      {!self && <Avatar user={user} />}
      <div class="message-box">
        <div class="nickname">{user.nickname}</div>
        <div class="message">{content}</div>
      </div>
      {self && <Avatar user={user} />}
    </div>
  );
}
