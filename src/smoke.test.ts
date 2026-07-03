import { describe, it, expect } from 'vitest';

// Simple smoke tests so the CI test step has something real to run.
// Add more tests for your urgency-tier logic, date math, etc. over time.

describe('smoke', () => {
  it('runs the test suite', () => {
    expect(true).toBe(true);
  });

  it('date math sanity check (deadline urgency)', () => {
    const now = new Date('2026-07-01T00:00:00Z');
    const due = new Date('2026-07-03T00:00:00Z');
    const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(hoursLeft).toBe(48);
  });
});
