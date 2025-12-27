import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDate,
  formatLaunchCardDate,
  formatDashboardDateTime,
  formatUpcomingLaunchDate,
} from './dateFormatter';

describe('dateFormatter', () => {
  it('should return "Date TBD" for invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('Date TBD');
    expect(formatDate('')).toBe('Date TBD');
    expect(formatDate('not-a-date')).toBe('Date TBD');
  });

  it('should format dates with different precision levels', () => {
    const dateString = '2022-06-15T10:30:00.000Z';
    
    expect(formatDate(dateString, { precision: 'year' })).toBe('2022');
    
    const monthResult = formatDate(dateString, { precision: 'month' });
    expect(monthResult).toContain('2022');
    expect(monthResult).toContain('June');
    
    const defaultResult = formatDate(dateString);
    expect(defaultResult).toBeTruthy();
    expect(typeof defaultResult).toBe('string');
  });

  it('should format relative time correctly', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00.000Z');
    vi.setSystemTime(now);

    const oneDayAgo = new Date('2024-01-14T12:00:00.000Z');
    const result = formatDate(oneDayAgo.toISOString(), { format: 'relative' });
    expect(result).toContain('ago');
    expect(result).toContain('day');
    
    const oneDayLater = new Date('2024-01-16T12:00:00.000Z');
    const futureResult = formatDate(oneDayLater.toISOString(), { format: 'relative' });
    expect(futureResult).toContain('in');
    expect(futureResult).toContain('day');
    
    vi.useRealTimers();
  });

  it('should format launch card dates correctly', () => {
    const dateString = '2022-06-15T10:30:00.000Z';
    const result = formatLaunchCardDate(dateString);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    
    const yearResult = formatLaunchCardDate(dateString, 'year');
    expect(yearResult).toBe('2022');
    
    expect(formatLaunchCardDate('invalid-date')).toBe('Date TBD');
  });

  it('should format dashboard date time with time included', () => {
    const dateString = '2022-01-15T14:30:00.000Z';
    const result = formatDashboardDateTime(dateString);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toContain('2022');
    
    const relativeResult = formatUpcomingLaunchDate(dateString);
    expect(relativeResult).toBeTruthy();
    expect(typeof relativeResult).toBe('string');
  });
});
