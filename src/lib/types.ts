export interface Squad {
  name: string;
  short_name: string;
}

export interface StreamingSource {
  name: string;
  url?: string;
  manifest?: string;
}

export interface Tour {
  name: string;
}

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
  event_category: string;
  match_name: string;
  event_name: string;
}

export interface ApiData {
  matches: any[];
  last_updated?: string;
  meta?: {
    last_updated_at: string;
  };
}
