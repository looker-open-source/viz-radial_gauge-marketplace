// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import { calculateTrellisLimit } from './viz_gauge';

describe('calculateTrellisLimit', () => {

  test('should return the data length if it is smaller than the grid max (row)', () => {
    // 2x2 grid (max 4), but only 3 data points. It should return 3.
    const result = calculateTrellisLimit('row', 2, 2, 3, 0);
    expect(result).toBe(3);
  });

  test('should return the grid max if data length is larger (row)', () => {
    // 2x2 grid (max 4), with 10 data points. It should cap at 4.
    const result = calculateTrellisLimit('row', 2, 2, 10, 0);
    expect(result).toBe(4);
  });

  test('should calculate correctly for pivots', () => {
    // 3x3 grid (max 9), with 5 pivot points. It should return 5.
    const result = calculateTrellisLimit('pivot', 3, 3, 100, 5);
    expect(result).toBe(5);
  });

});
