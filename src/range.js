export function resolveGoal(config, data, meas, mesID) {
  if (config.range_max_source === 'second' && meas.length >= 2) {
    return data[0][meas[1].name].value;
  }
  if (
    config.range_max_source === 'first' &&
    config.viz_trellis_by !== 'row' &&
    data.length >= 2
  ) {
    return data[1][mesID].value;
  }
  return null;
}

export function resolveRangeMax(chunk, config) {
  if (chunk.goal != null && chunk.goal > 0) {
    return chunk.goal;
  }
  if (config.range_max) {
    return config.range_max;
  }
  const num = Math.max(
    Math.ceil(chunk.value),
    chunk.target ? Math.ceil(chunk.target) : 0
  );
  const len = (num + '').length;
  const fac = Math.pow(10, len - 1);
  return Math.ceil(num / fac) * fac;
}
