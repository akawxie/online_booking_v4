import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';

export function useBookings() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_time');
      
      if (error) throw error;
      
      return data.map(booking => ({
        id: booking.id,
        instrumentId: booking.instrument_id,
        userId: booking.user_id,
        startTime: new Date(booking.start_time),
        endTime: new Date(booking.end_time),
        purpose: booking.purpose,
      }));
    },
  });

  const createBooking = useMutation({
    mutationFn: async (booking: Omit<Booking, 'id'>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          instrument_id: booking.instrumentId,
          user_id: booking.userId,
          start_time: booking.startTime.toISOString(),
          end_time: booking.endTime.toISOString(),
          purpose: booking.purpose,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return {
    bookings,
    isLoading,
    createBooking: createBooking.mutate,
    deleteBooking: deleteBooking.mutate,
  };
}