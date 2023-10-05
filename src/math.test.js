import {mapBetween} from './math';

describe('mapBetween', () => {
  test('should map the number within the allowable range', () => {
    expect(mapBetween(4, 0, 5, 1, 3)).toEqual(7.5);

    expect(mapBetween(4, 2, 5, 1, 3)).toEqual(6.5);
    expect(mapBetween(4, 0, 4, 1, 3)).toEqual(6);
    expect(mapBetween(4, 0, 5, 4, 3)).toEqual(0);
  });

  test('should map the number within the allowable range', () => {
    expect(mapBetween(1, 0, 5, 1, 3)).toEqual(0);
    expect(mapBetween(2, 0, 5, 1, 3)).toEqual(2.5);
    expect(mapBetween(3, 0, 5, 1, 3)).toEqual(5);
    expect(mapBetween(4, 0, 5, 1, 3)).toEqual(7.5);
    expect(mapBetween(5, 0, 5, 1, 3)).toEqual(10);
  });

  // FIXME: Are we sure this function maps a number within an allowable range correctly?
  test('should map the number within the allowable range (bad cases?)', () => {
    expect(mapBetween(-2, 0, 5, 1, 3)).toEqual(-7.5);
    expect(mapBetween(-1, 0, 5, 1, 3)).toEqual(-5);
    expect(mapBetween(0, 0, 5, 1, 3)).toEqual(-2.5);
  });
});
