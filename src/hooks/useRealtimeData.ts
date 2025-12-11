import { useState, useEffect } from 'react';
import { roundabouts, districts, alerts, Roundabout, District, Alert } from '../data/mockData';
import { apiService } from '../services/api';

export function useRealtimeData() {
  const [liveRoundabouts, setLiveRoundabouts] = useState<Roundabout[]>(roundabouts);
  const [liveDistricts, setLiveDistricts] = useState<District[]>(districts);
  const [liveAlerts, setLiveAlerts] = useState<Alert[]>(alerts);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [roundaboutsData, districtsData, alertsData] = await Promise.all([
        apiService.getRoundabouts(),
        apiService.getDistricts(),
        apiService.getAlerts(),
      ]);

      setLiveRoundabouts(roundaboutsData);
      setLiveDistricts(districtsData);
      setLiveAlerts(alertsData);
      setIsOnline(true);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data from API, using mock data:', err);
      setIsOnline(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Keep using existing data (mock data on first load, or last successful fetch)
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    roundabouts: liveRoundabouts,
    districts: liveDistricts,
    alerts: liveAlerts,
    isOnline,
    error,
  };
}
