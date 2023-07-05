/** Regular expression for the special characters that are trimmed by
 * default from a string. */
const LEADING_TRAILING_SPECIAL_CHARS_REGEX =
  /(^| +)[!-\/:-@\[-`\{-~]*([^ ]*?)[!-\/:-@\[-`\{-~]*(?=\s|$)/gi;

/**
 * Trims leading and trailing special characters from the string.
 *
 * @param {string} str The string to trim.
 * @param {RegExp} pattern The pattern representing the special charaters.
 * @return {string} The sanitized string.
 */
export function trimSpecialCharacters(
  str,
  pattern = LEADING_TRAILING_SPECIAL_CHARS_REGEX
) {
  return str.replace(pattern, '$1$2');
}
