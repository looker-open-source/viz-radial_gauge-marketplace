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

/**
 * Determines the label given a rule, a value, an existing label and an override.
 *
 * @param {string} rule The rule to match.
 * @param {string} value The value to be used if the rule is mean to use a value.
 * @param {string} label The label if the rule is meant to use a label.
 * @param {string} override An override for the label.
 * @return {string} The label based on the rule.
 */
export function getLabel(rule, value, label, override) {
  label = override || label;
  switch(rule) {
    case 'value':
      return `${value}`;
    case 'label':
      return `${label}`;
    case 'both':
      return `${value} ${label}`;
    case 'none':
    default:
      return ``;
  }
}
