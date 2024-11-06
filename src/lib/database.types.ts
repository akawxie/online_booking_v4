export interface Database {
  public: {
    Tables: {
      instruments: {
        Row: {
          id: string;
          name: string;
          type: string;
          location: string;
          status: 'Available' | 'Maintenance' | 'Out of Service';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['instruments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['instruments']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          instrument_id: string;
          user_id: string;
          start_time: string;
          end_time: string;
          purpose: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
    };
  };
}