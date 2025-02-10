import { camelToKebab } from '../util';

// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
const voidElements: string[] = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

function isVoidElement(tag: string): boolean {
  return voidElements.includes(tag);
}

function isTag(value: string) {}

// https://developer.mozilla.org/en-US/docs/Glossary/Character_reference
const reference = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos',
};
type Char = keyof typeof reference;

function escape(html: unknown): string {
  return String(html).replace(/[&<>"']/g, char => `&${reference[<Char>char]};`);
}

function serialize(children: unknown): unknown {
  switch (true) {
    case typeof children === 'number':
      return String(children);
    case !children:
    case typeof children === 'boolean':
      return '';
    case Array.isArray(children):
      return children.map(serialize).join('');
    default:
      return children;
  }
}

function parseAttribute(name: string, value: unknown): string {
  // https://developer.mozilla.org/en-US/docs/Glossary/Attribute
  switch (true) {
    case typeof value === 'boolean':
      // https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML
      value = '';
      break;
    case name === 'style' && value && typeof value === 'object':
      value = Object.entries(value)
        .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
        .join('; ');
      break;
    case name === 'class' && Array.isArray(value):
      value = value.join(' ');
      break;
    case name === 'class' && value && typeof value === 'object':
      value = Object.entries(value)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(' ');
      break;
    default:
      value = String(value);
      break;
  }
  return `${name}="${value}"`;
}

export function Fragment(props: Props): JSXElement {
  return props.children;
}

export function jsx(type: Type, props: Props): string {
  if (typeof type === 'function') {
    return type({ ...props });
  }
  const { children = '', dangerouslySetInnerHTML, ...attrProps } = props;
  const attributes: string = Object.entries(attrProps)
    .map(attribute => parseAttribute(...attribute))
    .join(' ');
  const is_void: boolean = isVoidElement(type);

  if (is_void) {
    return `<${type} ${attributes} />`;
  }
  const openingTag: string = attributes ? `<${type} ${attributes}>` : `<${type}>`;
  const closingTag: string = `</${type}>`;
  const textContent: string = dangerouslySetInnerHTML?.__html ?? serialize(children);

  return `${openingTag}${textContent}${closingTag}`;
}

export const jsxs = jsx;
