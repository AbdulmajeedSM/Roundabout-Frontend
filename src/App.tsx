import { useState } from 'react';
import { Header } from './components/Header';
import { DistrictMap } from './components/DistrictMap';
import { DistrictList } from './components/DistrictList';
import { AlertsPanel } from './components/AlertsPanel';
import { RoundaboutDetail } from './components/RoundaboutDetail';
import { useRealtimeData } from './hooks/useRealtimeData';

export type TimeRange = 'ساعة' | '4 ساعات' | 'اليوم' | 'الأسبوع';

export default function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>('اليوم');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedRoundabout, setSelectedRoundabout] = useState<string | null>(null);
  
  const { roundabouts, districts, alerts } = useRealtimeData();

return (
  <div className="min-h-screen bg-slate-50" dir="rtl">
    <Header timeRange={timeRange} onTimeRangeChange={setTimeRange} />

    <main className="container mx-auto p-4 lg:p-6" dir="rtl">
      {selectedRoundabout ? (
        <RoundaboutDetail
          roundaboutId={selectedRoundabout}
          timeRange={timeRange}
          onBack={() => setSelectedRoundabout(null)}
          roundabouts={roundabouts}
          districts={districts}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
          {/* العمود الأيسر - الخريطة والأحياء */}
          <div className="lg:col-span-2 space-y-6">
            <DistrictMap
              selectedDistrict={selectedDistrict}
              onDistrictSelect={setSelectedDistrict}
              timeRange={timeRange}
              districts={districts}
            />

            <DistrictList
              selectedDistrict={selectedDistrict}
              onDistrictSelect={setSelectedDistrict}
              onRoundaboutSelect={setSelectedRoundabout}
              timeRange={timeRange}
              districts={districts}
              roundabouts={roundabouts}
            />
          </div>

          {/* العمود الأيمن - التنبيهات */}
          <div className="lg:col-span-1">
            <AlertsPanel
              timeRange={timeRange}
              onRoundaboutSelect={setSelectedRoundabout}
              alerts={alerts}
            />
          </div>
        </div>
      )}
    </main>
  </div>
);
}