export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          is_premium?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          sport_type: string;
          name: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          elapsed_time: number;
          moving_time: number;
          distance: number;
          total_elevation_gain: number;
          average_speed: number;
          max_speed: number;
          average_heart_rate: number | null;
          max_heart_rate: number | null;
          calories: number | null;
          route: Json | null;
          map_polyline: string | null;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sport_type: string;
          name: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          elapsed_time?: number;
          moving_time?: number;
          distance?: number;
          total_elevation_gain?: number;
          average_speed?: number;
          max_speed?: number;
          average_heart_rate?: number | null;
          max_heart_rate?: number | null;
          calories?: number | null;
          route?: Json | null;
          map_polyline?: string | null;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_private?: boolean;
        };
        Relationships: [];
      };
      followers: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      kudos: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: { content?: string };
        Relationships: [];
      };
      segments: {
        Row: {
          id: string;
          name: string;
          sport_type: string;
          distance: number;
          average_grade: number;
          maximum_grade: number;
          elevation_high: number;
          elevation_low: number;
          start_latlng: number[];
          end_latlng: number[];
          city: string | null;
          state: string | null;
          effort_count: number;
          athlete_count: number;
          kom_time: number | null;
          route: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport_type: string;
          distance: number;
          average_grade: number;
          maximum_grade: number;
          elevation_high: number;
          elevation_low: number;
          start_latlng: number[];
          end_latlng: number[];
          city?: string | null;
          state?: string | null;
          effort_count?: number;
          athlete_count?: number;
          kom_time?: number | null;
          route?: Json | null;
          created_at?: string;
        };
        Update: {
          effort_count?: number;
          athlete_count?: number;
          kom_time?: number | null;
        };
        Relationships: [];
      };
      segment_efforts: {
        Row: {
          id: string;
          segment_id: string;
          activity_id: string;
          user_id: string;
          elapsed_time: number;
          start_date: string;
          distance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          segment_id: string;
          activity_id: string;
          user_id: string;
          elapsed_time: number;
          start_date: string;
          distance: number;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
