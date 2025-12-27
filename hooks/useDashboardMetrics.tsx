"use client";

import { useMemo } from "react";
import { Launch, DashboardMetrics } from "@/types";
import { calculateAllMetrics } from "@/utils/metrics";

export const useDashboardMetrics = (
  launches: Launch[]
): DashboardMetrics | null => {
  return useMemo(() => {
    if (!launches || launches.length === 0) {
      return {
        totalLaunches: 0,
        upcomingLaunches: 0,
        successRate: 0,
        mostUsedRocket: null,
      };
    }

    return calculateAllMetrics(launches);
  }, [launches]);
};
