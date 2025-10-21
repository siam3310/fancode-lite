export interface Match {
  match_id: number;
  title: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time: number;
  image_url: string;
  tour: Tour;
  squad_a: Squad;
  squad_b: Squad;
  streaming_sources: StreamingSource[];
  dai_url?: string;
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
  matches: Match[];
  meta: {
    last_updated_at: string;
  };
}
