/**
 * Maps a number between a certain range offset by minAllowed.
 *
 * @param {number} n The number to map to a range.
 * @param {number} minAllowed The minimum allowed for the range.
 * @param {number} maxAllowed The maximum allowed for the range.
 * @param {number} min The minimum value for the number.
 * @param {number} max The maximum value for the number.
 * @return {number} A number within the projected range.
 */
export function mapBetween(n, minAllowed, maxAllowed, min, max) {
  // TODO: This function has been refactored and moved into this file as is
  // It has yet to be checked for accuracy and validation has to be added.
  const numerator = (maxAllowed - minAllowed) * (n - min);
  const denominator = max - min;
  return numerator / denominator + minAllowed;
}
