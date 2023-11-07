import {getLabel, trimSpecialCharacters} from '../string';

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

describe('getLabel', () => {
  test('should return the label if the rule specifies so', () => {
    expect(getLabel('label', 'foo', 'labelle', '')).toEqual('labelle');
  });
  test('should return the label override if the rule specifies so and one has been provided', () => {
    expect(getLabel('label', 'foo', 'labelle', null)).toEqual('labelle');
    expect(getLabel('label', 'foo', 'labelle', undefined)).toEqual('labelle');
    expect(getLabel('label', 'foo', 'labelle', '')).toEqual('labelle');
    expect(getLabel('label', 'foo', 'labelle', 'foobar')).toEqual('foobar');
  });
  test('should return the value if the rule specifies so', () => {
    expect(getLabel('value', 'foo', 'labelle', '')).toEqual('foo');
  });
  test('should return the both value and label if the rule specifies so', () => {
    expect(getLabel('both', 'foo', 'labelle', '')).toEqual('foo labelle');
  });
  test('should return empty string otherwise', () => {
    expect(getLabel('none', 'foo', 'labelle', '')).toEqual('');
    expect(getLabel('', 'foo', 'labelle', '')).toEqual('');
  });
});
