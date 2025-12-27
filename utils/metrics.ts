import { Launch, DashboardMetrics } from "@/types";

export const calculateTotalLaunches = (launches: Launch[]): number => {
  return launches.length;
};

export const calculateUpcomingLaunches = (launches: Launch[]): number => {
  return launches.filter((l) => {
    if (!l.date_utc) return false;
    const launchDate = new Date(l.date_utc);
    const year = launchDate.getFullYear();
    return year === 2022;
  }).length;
};

export const calculateSuccessRate = (launches: Launch[]): number => {
  const completed = launches.filter(
    (l) => l.upcoming === false && l.success !== null && l.success !== undefined
  );
  
  if (!completed.length) return 0;

  const successes = completed.filter((l) => l.success === true).length;
  return Math.round((successes / completed.length) * 100);
};

export const calculateMostUsedRocket = (
  launches: Launch[]
): { id: string; name: string; count: number } | null => {
  const counts: Record<string, number> = {};

  launches.forEach((launch) => {
    if (!launch.rocket) return;
    counts[launch.rocket] = (counts[launch.rocket] || 0) + 1;
  });

  if (Object.keys(counts).length === 0) return null;

  const [rocketId, count] = Object.entries(counts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const rocketNames: Record<string, string> = {
    "5e9d0d95eda69955f709d1eb": "Falcon 1",
    "5e9d0d95eda69973a809d1ec": "Falcon 9",
    "5e9d0d95eda69974db09d1ed": "Falcon Heavy",
    "5e9d0d96eda699382d09d1ee": "Starship",
  };

  return {
    id: rocketId,
    name: rocketNames[rocketId] || rocketId,
    count: count,
  };
};

export const calculateAllMetrics = (launches: Launch[]): DashboardMetrics => {
  return {
    totalLaunches: calculateTotalLaunches(launches),
    upcomingLaunches: calculateUpcomingLaunches(launches),
    successRate: calculateSuccessRate(launches),
    mostUsedRocket: calculateMostUsedRocket(launches),
  };
};
