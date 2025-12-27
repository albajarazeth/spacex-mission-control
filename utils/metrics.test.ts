import { describe, it, expect } from 'vitest';
import {
  calculateTotalLaunches,
  calculateSuccessRate,
  calculateMostUsedRocket,
  calculateAllMetrics,
  calculateUpcomingLaunches,
} from './metrics';
import { Launch } from '@/types';

describe('metrics', () => {
  it('should calculate total launches correctly', () => {
    expect(calculateTotalLaunches([])).toBe(0);
    
    const launches: Launch[] = [
      { id: '1', name: 'Launch 1', date_utc: '2020-01-01T00:00:00.000Z', success: true, upcoming: false },
      { id: '2', name: 'Launch 2', date_utc: '2020-02-01T00:00:00.000Z', success: false, upcoming: false },
      { id: '3', name: 'Launch 3', date_utc: '2020-03-01T00:00:00.000Z', success: true, upcoming: false },
    ];
    expect(calculateTotalLaunches(launches)).toBe(3);
  });

  it('should calculate success rate correctly', () => {
    expect(calculateSuccessRate([])).toBe(0);
    
    const launches: Launch[] = [
      { id: '1', name: 'Launch 1', date_utc: '2020-01-01T00:00:00.000Z', success: true, upcoming: false },
      { id: '2', name: 'Launch 2', date_utc: '2020-02-01T00:00:00.000Z', success: true, upcoming: false },
      { id: '3', name: 'Launch 3', date_utc: '2020-03-01T00:00:00.000Z', success: false, upcoming: false },
    ];
    expect(calculateSuccessRate(launches)).toBe(67); // 2/3 * 100 = 66.67, rounded to 67
  });

  it('should identify the most used rocket', () => {
    expect(calculateMostUsedRocket([])).toBeNull();
    
    const falcon9Id = '5e9d0d95eda69973a809d1ec';
    const falconHeavyId = '5e9d0d95eda69974db09d1ed';
    const launches: Launch[] = [
      { id: '1', name: 'Launch 1', date_utc: '2020-01-01T00:00:00.000Z', success: true, upcoming: false, rocket: falcon9Id },
      { id: '2', name: 'Launch 2', date_utc: '2020-02-01T00:00:00.000Z', success: true, upcoming: false, rocket: falcon9Id },
      { id: '3', name: 'Launch 3', date_utc: '2020-03-01T00:00:00.000Z', success: true, upcoming: false, rocket: falconHeavyId },
    ];
    const result = calculateMostUsedRocket(launches);
    expect(result).toEqual({
      id: falcon9Id,
      name: 'Falcon 9',
      count: 2,
    });
  });

  it('should count 2022 launches as upcoming', () => {
    const launches: Launch[] = [
      { id: '1', name: 'Launch 1', date_utc: '2022-01-15T00:00:00.000Z', success: null, upcoming: false },
      { id: '2', name: 'Launch 2', date_utc: '2022-06-20T12:00:00.000Z', success: null, upcoming: false },
      { id: '3', name: 'Launch 3', date_utc: '2021-12-31T23:59:59.999Z', success: true, upcoming: false },
    ];
    expect(calculateUpcomingLaunches(launches)).toBe(2);
  });

  it('should calculate all metrics together', () => {
    const falcon9Id = '5e9d0d95eda69973a809d1ec';
    const launches: Launch[] = [
      { id: '1', name: 'Launch 1', date_utc: '2021-01-01T00:00:00.000Z', success: true, upcoming: false, rocket: falcon9Id },
      { id: '2', name: 'Launch 2', date_utc: '2021-02-01T00:00:00.000Z', success: true, upcoming: false, rocket: falcon9Id },
      { id: '3', name: 'Launch 3', date_utc: '2021-03-01T00:00:00.000Z', success: false, upcoming: false, rocket: falcon9Id },
    ];

    const metrics = calculateAllMetrics(launches);

    expect(metrics.totalLaunches).toBe(3);
    expect(metrics.upcomingLaunches).toBe(0);
    expect(metrics.successRate).toBe(67); // 2/3 = 67%
    expect(metrics.mostUsedRocket).toEqual({
      id: falcon9Id,
      name: 'Falcon 9',
      count: 3,
    });
  });
});
