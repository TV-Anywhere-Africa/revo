/**
 * Gets object key from value name
 * @param object
 * @param value
 * @returns key name
 */
export function getObjectKeyByValue(object: any, value: string) {
  return Object.keys(object).find((key: any) => object[key] === value);
}
