import { Activity, Clock } from 'lucide-react';
import { TimeRange } from '../App';

interface HeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function Header({ timeRange, onTimeRangeChange }: HeaderProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'hour', label: 'آخر ساعة' },
    { value: '4hours', label: 'آخر 4 ساعات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
  ];

  return (
<header
  className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm"
  dir="rtl"
>
  <div className="container mx-auto px-4 lg:px-6 py-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* الشعار والعنوان */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-slate-900 font-bold">مركز إدارة عمليات مدينة الرياض</h1>
          <p className="text-slate-500 text-sm">لوحة متابعة الدوارات</p>
        </div>
      </div>

{/* محدد الفترة الزمنية */}
<div className="flex items-center gap-2" dir="rtl">
  <Clock className="size-4 text-slate-400" />

  <div className="flex bg-slate-100 rounded-lg p-1">
    {timeRanges.map((range) => (
      <button
        key={range.value}
        onClick={() => onTimeRangeChange(range.value)}
        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
          timeRange === range.value
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {range.label /* ← تأكد أن labels عربية */ }
      </button>
    ))}
  </div>
</div>

    </div>
  </div>
</header>
  );
}
