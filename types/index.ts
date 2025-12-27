/**
 * Type definitions for SpaceX API data
 */

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_precision?: "year" | "month" | "day" | "hour";
  success: boolean | null;
  upcoming: boolean;
  rocket?: string;
  launchpad?: string;
  details?: string;
  payloads?: string[];
  cores?: Array<{
    core?: string;
    flight?: number;
    gridfins?: boolean;
    legs?: boolean;
    reused?: boolean;
    landing_attempt?: boolean;
    landing_success?: boolean | null;
    landing_type?: string;
    landpad?: string;
  }>;
  links?: {
    patch?: {
      small?: string;
      large?: string;
    };
    webcast?: string;
    youtube_id?: string;
    article?: string;
    wikipedia?: string;
    reddit?: {
      campaign?: string;
      launch?: string;
      media?: string;
      recovery?: string;
    };
    flickr?: {
      small?: string[];
      original?: string[];
    };
  };
}

export interface Rocket {
  id: string;
  name: string;
  type?: string;
}

export interface DashboardMetrics {
  totalLaunches: number;
  upcomingLaunches: number;
  successRate: number;
  mostUsedRocket: {
    id: string;
    name: string;
    count: number;
  } | null;
}

