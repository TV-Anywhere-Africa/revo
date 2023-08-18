/**
 * Checks if a string is a valid email
 * @param str - String to be checked if is valid email
 * @returns `true` or `false`
 */
export default function isEmail(str: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(str);
}
