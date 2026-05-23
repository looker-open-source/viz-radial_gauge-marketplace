import {resolveGoal, resolveRangeMax} from './range';

const meas1 = [{name: 'm1'}];
const meas2 = [{name: 'm1'}, {name: 'm2'}];

describe('resolveGoal', () => {
  test('returns null when source is manual', () => {
    expect(resolveGoal({range_max_source: 'manual'}, [{m1: {value: 5}}], meas1, 'm1')).toBeNull();
  });

  test('returns null when source is undefined', () => {
    expect(resolveGoal({}, [{m1: {value: 5}}], meas1, 'm1')).toBeNull();
  });

  test('returns second measure value when source is "second" and 2 measures present', () => {
    const data = [{m1: {value: 5}, m2: {value: 80}}];
    expect(resolveGoal({range_max_source: 'second'}, data, meas2, 'm1')).toBe(80);
  });

  test('returns null when source is "second" but only 1 measure present', () => {
    expect(resolveGoal({range_max_source: 'second'}, [{m1: {value: 5}}], meas1, 'm1')).toBeNull();
  });

  test('returns row 2 of first measure when source is "first" and 2 rows present', () => {
    const data = [{m1: {value: 5}}, {m1: {value: 90}}];
    expect(resolveGoal({range_max_source: 'first'}, data, meas1, 'm1')).toBe(90);
  });

  test('returns null when source is "first" but only 1 row present', () => {
    expect(resolveGoal({range_max_source: 'first'}, [{m1: {value: 5}}], meas1, 'm1')).toBeNull();
  });

  test('returns null when source is "first" and trellis is row', () => {
    const data = [{m1: {value: 5}}, {m1: {value: 90}}];
    const config = {range_max_source: 'first', viz_trellis_by: 'row'};
    expect(resolveGoal(config, data, meas1, 'm1')).toBeNull();
  });
});

describe('resolveRangeMax', () => {
  test('returns goal when chunk.goal is positive', () => {
    const chunk = {goal: 80, value: 50, target: null};
    expect(resolveRangeMax(chunk, {range_max: null})).toBe(80);
  });

  test('goal wins over manual range_max', () => {
    const chunk = {goal: 120, value: 50, target: null};
    expect(resolveRangeMax(chunk, {range_max: 50})).toBe(120);
  });

  test('falls through to manual range_max when goal is null', () => {
    const chunk = {goal: null, value: 50, target: null};
    expect(resolveRangeMax(chunk, {range_max: 200})).toBe(200);
  });

  test('falls through to manual range_max when goal is zero', () => {
    const chunk = {goal: 0, value: 50, target: null};
    expect(resolveRangeMax(chunk, {range_max: 200})).toBe(200);
  });

  test('falls through to manual range_max when goal is negative', () => {
    const chunk = {goal: -10, value: 50, target: null};
    expect(resolveRangeMax(chunk, {range_max: 200})).toBe(200);
  });

  test('auto-computes from value when no goal and no range_max', () => {
    const chunk = {goal: null, value: 37, target: null};
    expect(resolveRangeMax(chunk, {range_max: null})).toBe(40);
  });

  test('auto-computes from max(value, target) when both present', () => {
    const chunk = {goal: null, value: 37, target: 85};
    expect(resolveRangeMax(chunk, {range_max: null})).toBe(90);
  });

  test('auto-compute rounds up to next decade', () => {
    expect(resolveRangeMax({goal: null, value: 123, target: null}, {range_max: null})).toBe(200);
    expect(resolveRangeMax({goal: null, value: 7, target: null}, {range_max: null})).toBe(7);
    expect(resolveRangeMax({goal: null, value: 1234, target: null}, {range_max: null})).toBe(2000);
  });
});
