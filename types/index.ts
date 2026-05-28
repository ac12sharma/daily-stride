export type SportType = "run" | "ride" | "walk" | "hike" | "swim";

export interface Coordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: number;
}

export interface Activity {
  id: string;
  user_id: string;
  sport_type: SportType;
  name: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  elapsed_time: number;
  moving_time: number;
  distance: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_heart_rate?: number | null;
  max_heart_rate?: number | null;
  calories?: number | null;
  route?: Coordinate[] | null;
  map_polyline?: string | null;
  is_private: boolean;
  created_at: string;
  // joined
  profile?: Profile | null;
  kudos_count?: number;
  comment_count?: number;
  has_kudos?: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  is_premium: boolean;
  follower_count?: number;
  following_count?: number;
  activity_count?: number;
  total_distance?: number;
  created_at: string;
}

export interface Kudo {
  id: string;
  activity_id: string;
  user_id: string;
  created_at: string;
  profile?: Profile;
}

export interface Comment {
  id: string;
  activity_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profile?: Profile;
}

export interface WeeklyStats {
  week_start: string;
  distance: number;
  moving_time: number;
  elevation_gain: number;
  activity_count: number;
  sport_type: SportType;
}

export interface Segment {
  id: string;
  name: string;
  sport_type: SportType;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: [number, number];
  end_latlng: [number, number];
  city?: string;
  state?: string;
  effort_count: number;
  athlete_count: number;
  kom_time?: number;
}

export interface SegmentEffort {
  id: string;
  segment_id: string;
  activity_id: string;
  user_id: string;
  elapsed_time: number;
  start_date: string;
  distance: number;
  rank?: number;
  profile?: Profile;
}

export type SubscriptionTier = "free" | "premium";
