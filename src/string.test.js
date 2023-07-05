import {trimSpecialCharacters} from './string';

describe('trimSpecialCharacters', () => {
  test('should trim leading special characters', () => {
    expect(trimSpecialCharacters('$$_aa')).toBe('aa');
  });
  test('should trim trailing special characters', () => {
    expect(trimSpecialCharacters('aa_$$')).toBe('aa');
  });
  test('should trim both leading and trailing special characters', () => {
    expect(trimSpecialCharacters('$$_aa_$$')).toBe('aa');
  });
  test('should leave empty string alone', () => {
    expect(trimSpecialCharacters('')).toBe('');
  });
});
