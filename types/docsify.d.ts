type Hook<T = void> = T extends unknown[]
  ? (callback: (...args: T) => void) => void
  : (callback: () => void) => void;

interface Docsify {}

interface DocsifyHook {
  /** 初始化完成后调用，只调用一次，没有参数。 */
  init: Hook;
  /** 每次开始解析 Markdown 内容时调用。 */
  beforeEach: Hook<[string]>;
  /** 解析成 html 后调用。 */
  afterEach: Hook<[string, (html: string) => void]>;
  /** 每次路由切换时数据全部加载完成后调用，没有参数。 */
  doneEach: Hook;
  /** 初始化并第一次加载完成数据后调用，只触发一次，没有参数。 */
  mounted: Hook;
  /** 初始化并第一次加载完成数据后调用，没有参数。 */
  ready: Hook;
}

interface User {
  avatar?: string;
  nickname: string;
}

interface DocsifyChatSetting {
  animation: number;
  myself: string | null;
  self: string | null;
  os: 'mac' | 'windows';
  title: string;
  users: User[];
  version: string;
}

interface Window {
  $docsify?: {
    chat?: Partial<DocsifyChatSetting>;
    plugins?: Function[];
  };
  // Docsify: Docsify;
}
