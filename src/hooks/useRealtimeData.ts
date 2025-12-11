import { useState, useEffect } from 'react';
import { roundabouts, districts, alerts, Roundabout, District, Alert } from '../data/mockData';

export function useRealtimeData() {
  const [liveRoundabouts, setLiveRoundabouts] = useState<Roundabout[]>(roundabouts);
  const [liveDistricts, setLiveDistricts] = useState<District[]>(districts);
  const [liveAlerts, setLiveAlerts] = useState<Alert[]>(alerts);

  useEffect(() => {
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setLiveRoundabouts((prev) =>
        prev.map((roundabout) => {
          // Small random variations
          const entryDelta = Math.floor(Math.random() * 40 - 20);
          const exitDelta = Math.floor(Math.random() * 40 - 20);
          const utilizationDelta = Math.floor(Math.random() * 6 - 3);

          const newEntry = Math.max(200, roundabout.vehicleEntry + entryDelta);
          const newExit = Math.max(200, roundabout.vehicleExit + exitDelta);
          const newUtilization = Math.min(100, Math.max(20, roundabout.laneUtilization + utilizationDelta));

          // Update trends
          const entryTrend = entryDelta > 5 ? 'up' : entryDelta < -5 ? 'down' : 'stable';
          const exitTrend = exitDelta > 5 ? 'up' : exitDelta < -5 ? 'down' : 'stable';

          // Update congestion level based on utilization
          let congestionLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
          if (newUtilization >= 90) congestionLevel = 'Critical';
          else if (newUtilization >= 75) congestionLevel = 'High';
          else if (newUtilization >= 55) congestionLevel = 'Moderate';
          else congestionLevel = 'Low';

          // Recalculate severity score
          const severityScore = Math.floor(
            newUtilization * 0.6 +
            (roundabout.riskyBehaviors.wrongWay * 2 +
              roundabout.riskyBehaviors.illegalUTurn +
              roundabout.riskyBehaviors.speeding) * 0.4
          );

          return {
            ...roundabout,
            vehicleEntry: newEntry,
            vehicleExit: newExit,
            entryTrend: entryTrend as 'up' | 'down' | 'stable',
            exitTrend: exitTrend as 'up' | 'down' | 'stable',
            laneUtilization: newUtilization,
            congestionLevel,
            severityScore: Math.min(100, severityScore),
            lastUpdated: new Date(),
          };
        })
      );

      // Update districts based on roundabouts
      setLiveDistricts((prev) =>
        prev.map((district) => {
          const districtRoundabouts = liveRoundabouts.filter(r => r.districtId === district.id);
          const avgCongestion = Math.floor(
            districtRoundabouts.reduce((sum, r) => sum + r.laneUtilization, 0) / districtRoundabouts.length
          );

          let severity: 'optimal' | 'attention' | 'concern' | 'critical';
          if (avgCongestion >= 85) severity = 'critical';
          else if (avgCongestion >= 70) severity = 'concern';
          else if (avgCongestion >= 50) severity = 'attention';
          else severity = 'optimal';

          return {
            ...district,
            congestionScore: avgCongestion,
            severity,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [liveRoundabouts]);

  return {
    roundabouts: liveRoundabouts,
    districts: liveDistricts,
    alerts: liveAlerts,
  };
}
