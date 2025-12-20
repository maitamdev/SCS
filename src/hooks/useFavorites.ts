import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Favorite {
  id: string;
  station_id: string;
  created_at: string;
  station?: {
    id: string;
    name: string;
    address: string;
    provider: string;
    image_url: string;
    lat: number;
    lng: number;
  };
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(`
          *,
          station:stations(id, name, address, provider, image_url, lat, lng)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFavorites(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (stationId: string) => {
    if (!supabase || !user) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          station_id: stationId,
        });

      if (insertError) throw insertError;
      await fetchFavorites();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const removeFavorite = async (stationId: string) => {
    if (!supabase || !user) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('station_id', stationId);

      if (deleteError) throw deleteError;
      await fetchFavorites();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(f => f.station_id === stationId);
  };

  const toggleFavorite = async (stationId: string) => {
    if (isFavorite(stationId)) {
      return removeFavorite(stationId);
    } else {
      return addFavorite(stationId);
    }
  };

  return { 
    favorites, 
    loading, 
    error, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    toggleFavorite,
    refetch: fetchFavorites 
  };
}
