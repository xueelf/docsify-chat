/**
 * 字符串转换 color 十六进制
 *
 * @param string - 字符
 * @returns 十六进制
 */
export function stringToColor(string: string) {
  let hash = 0;
  let color = '#';

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
