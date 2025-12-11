import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { getSeverityColor, getSeverityBgColor, getSeverityBorderColor, District } from '../data/mockData';
import { TimeRange } from '../App';

interface DistrictMapProps {
  selectedDistrict: string | null;
  onDistrictSelect: (districtId: string | null) => void;
  timeRange: TimeRange;
  districts: District[];
}

export function DistrictMap({ selectedDistrict, onDistrictSelect, districts }: DistrictMapProps) {
return (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" dir="rtl">

    <div className="flex items-center justify-between mb-6">

      {/* العنوان + الوصف */}
      <div>
        <h2 className="text-slate-900">نظرة عامة على الأحياء</h2>
        <p className="text-slate-500 text-sm mt-1">
          مُرمّزة بالألوان حسب مستوى الخطورة
        </p>
      </div>

      {/* وسيلة توضيح الألوان */}
      <div className="flex items-center gap-4 text-xs" dir="rtl">
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-green-500"></div>
          <span className="text-slate-600">مستوى مثالي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-yellow-500"></div>
          <span className="text-slate-600">مستوى يحتاج انتباه</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-orange-500"></div>
          <span className="text-slate-600">مستوى مقلق</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-red-500"></div>
          <span className="text-slate-600">مستوى حرج</span>
        </div>
      </div>

    </div>

    {/* خريطة الأحياء */}
    <div className="relative bg-slate-50 rounded-lg border border-slate-200 aspect-[16/10] overflow-hidden">

      {/* خلفية الشبكة */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* عناصر الأحياء */}
      {districts.map((district) => {
        const isSelected = selectedDistrict === district.id;
        const positionX = ((district.longitude - 46.5) / 0.4) * 100;
        const positionY = ((24.9 - district.latitude) / 0.4) * 100;

        return (
          <button
            key={district.id}
            onClick={() => onDistrictSelect(isSelected ? null : district.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isSelected ? 'z-10 scale-110' : 'hover:scale-105'
            }`}
            style={{
              left: `${positionX}%`,
              top: `${positionY}%`,
            }}
          >
            <div
              className={`relative ${getSeverityBgColor(district.severity)} ${getSeverityBorderColor(district.severity)}
                border-2 rounded-lg p-3 shadow-lg min-w-[140px] ${
                  isSelected ? 'ring-4 ring-blue-300' : ''
                }`}
            >
              <div className="flex items-start gap-2">
                <MapPin
                  className={`size-4 ${getSeverityColor(district.severity)} flex-shrink-0 mt-0.5`}
                />
                <div className="text-right flex-1">
                  <div className="text-slate-900 text-sm">{district.name}</div>
                  <div className="text-slate-600 text-xs mt-1">
                    {district.totalRoundabouts} دوارات
                  </div>
                </div>
              </div>

              {/* شارة التنبيهات */}
              {district.activeAlerts > 0 ? (
                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full size-6 flex items-center justify-center animate-pulse">
                  {district.activeAlerts}
                </div>
              ) : (
                <div className="absolute -top-2 -left-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="size-3 text-white" />
                </div>
              )}

              {/* نسبة الازدحام */}
              <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">الازدحام</span>
                  <span className={`text-sm ${getSeverityColor(district.severity)}`}>
                    {district.congestionScore}%
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* معلومات المدينة */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
        <div className="text-slate-900 text-sm">مناطق قريبة من مترو الرياض</div>
        <div className="text-slate-500 text-xs">{districts.length} حي مراقب</div>
      </div>

    </div>

    {/* ملخص الحالة */}
    <div className="mt-4 grid grid-cols-4 gap-3" dir="rtl">
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="text-slate-600 text-xs">إجمالي الدوارات</div>
        <div className="text-slate-900 text-xl mt-1">
          {districts.reduce((sum, d) => sum + d.totalRoundabouts, 0)}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="text-slate-600 text-xs">التنبيهات الفعّالة</div>
        <div className="text-red-600 text-xl mt-1 flex items-center gap-1">
          {districts.reduce((sum, d) => sum + d.activeAlerts, 0)}
          <AlertTriangle className="size-4" />
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="text-slate-600 text-xs">متوسط الازدحام</div>
        <div className="text-slate-900 text-xl mt-1">
          {Math.round(
            districts.reduce((sum, d) => sum + d.congestionScore, 0) /
              districts.length
          )}
          %
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="text-slate-600 text-xs">الأحياء الحرجة</div>
        <div className="text-red-600 text-xl mt-1">
          {districts.filter((d) => d.severity === 'critical').length}
        </div>
      </div>
    </div>

  </div>
);
}