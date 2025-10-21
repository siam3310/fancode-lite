export interface Match {
  match_id: number;
  title: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time: number; // This will be converted from string at fetch time
  startTime: string; // Original string time
  image_url: string;
  tour: Tour;
  squad_a: Squad;
  squad_b: Squad;
  streaming_sources: StreamingSource[];
  dai_url?: string;
  // New fields from the new API
  event_category: string;
  team_1: string;
  team_2: string;
  event_name: string;
  match_name: string;
  adfree_url?: string;
  src?: string;
}

export interface Tour {
  tour_id: number;
  name: string;
}

export interface Squad {
  squad_id: number;
  name: string;
  short_name: string;
  image_url: string;
}

export interface StreamingSource {
  platform: string;
  url: string;
}

export interface ApiData {
  matches: any[]; // Using any to accommodate the change in structure temporarily
  meta?: {
    last_updated_at: string;
  };
}