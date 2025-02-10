type Type = string | ((props: Props) => ReturnType<Type>);

type Props = Record<string, string | number | boolean | null | undefined | Props | Props[]>;

type JSXElement = {
  type: Type;
  props: Props;
};

type TagProps<T extends HTMLElement> = Partial<Omit<T, 'class' | 'style'>> & {
  class?: string | string[] | Record<string, boolean>;
  style?: Partial<CSSStyleDeclaration>;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
};

namespace JSX {
  interface IntrinsicElements {
    div: TagProps<HTMLDivElement>;
    img: TagProps<HTMLImageElement>;
    button: TagProps<HTMLButtonElement>;
    span: TagProps<HTMLSpanElement>;
    header: TagProps<HTMLHeadElement>;
    input: TagProps<HTMLInputElement>;
  }
}
