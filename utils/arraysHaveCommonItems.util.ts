/**
 * Check if two arrays have common items
 * @param arr1 First array
 * @param arr2 Second array
 * @returns boolean
 */
export default function arraysHaveCommonItems(arr1: any[], arr2: any[]) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) if (arr1[i] === arr2[j]) return true;
  }
  return false;
}
