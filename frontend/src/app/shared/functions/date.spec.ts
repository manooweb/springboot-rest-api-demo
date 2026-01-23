import { toIsoLocalDateString } from './date';

describe('toIsoLocalDateString', () => {
  it('should format date as YYYY-MM-DD using local date parts', () => {
    const date = new Date(2026, 0, 15); // Jan 15, 2026 (local)
    expect(toIsoLocalDateString(date)).toBe('2026-01-15');
  });
});
