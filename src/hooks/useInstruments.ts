import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Instrument } from '../types';

export function useInstruments() {
  const queryClient = useQueryClient();

  const { data: instruments = [], isLoading } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data.map(instrument => ({
        id: instrument.id,
        name: instrument.name,
        type: instrument.type,
        location: instrument.location,
        status: instrument.status,
        imageUrl: instrument.image_url,
      }));
    },
  });

  const addInstrument = useMutation({
    mutationFn: async (instrument: Omit<Instrument, 'id'>) => {
      const { data, error } = await supabase
        .from('instruments')
        .insert([{
          name: instrument.name,
          type: instrument.type,
          location: instrument.location,
          status: instrument.status,
          image_url: instrument.imageUrl,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instruments'] });
    },
  });

  const updateInstrument = useMutation({
    mutationFn: async (instrument: Instrument) => {
      const { data, error } = await supabase
        .from('instruments')
        .update({
          name: instrument.name,
          type: instrument.type,
          location: instrument.location,
          status: instrument.status,
          image_url: instrument.imageUrl,
        })
        .eq('id', instrument.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instruments'] });
    },
  });

  const deleteInstrument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('instruments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instruments'] });
    },
  });

  return {
    instruments,
    isLoading,
    addInstrument: addInstrument.mutate,
    updateInstrument: updateInstrument.mutate,
    deleteInstrument: deleteInstrument.mutate,
  };
}