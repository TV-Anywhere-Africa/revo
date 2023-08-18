/**
 * Capitalizes all first letters of a string and returns a new string
 * @param str Text to be formatted
 * @returns String with first letters capitalised
 */
export default function capitalizeFirstLetters(str: string) {
  const words = str.toLowerCase().split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const capitalizedStr = capitalizedWords.join(" ");
  return capitalizedStr;
}
