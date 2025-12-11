import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Send, Check, AlertCircle as AlertIcon } from 'lucide-react';
import { getSeverityColor, getSeverityBgColor, formatTimeAgo, Alert } from '../data/mockData';
import { TimeRange } from '../App';

interface AlertsPanelProps {
  timeRange: TimeRange;
  onRoundaboutSelect: (roundaboutId: string) => void;
  alerts: Alert[];
}

export function AlertsPanel({ onRoundaboutSelect, alerts }: AlertsPanelProps) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const handleAcknowledge = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleDispatch = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would trigger dispatch logic
    alert(`Dispatch team to alert: ${alertId}`);
  };

  // Sort alerts by severity score (descending)
  const sortedAlerts = [...alerts].sort((a, b) => b.severityScore - a.severityScore);

  // Group by district
  const groupedAlerts = sortedAlerts.reduce((acc, alert) => {
    if (!acc[alert.districtName]) {
      acc[alert.districtName] = [];
    }
    acc[alert.districtName].push(alert);
    return acc;
  }, {} as Record<string, Alert[]>);

  const activeAlertsCount = alerts.filter(a => !a.acknowledged && !acknowledgedAlerts.has(a.id)).length;

return (
  <div
    className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col"
    dir="rtl"
  >
    {/* الهيدر */}
    <div className="p-6 border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-slate-900">تنبيهات الأولوية</h2>

        {activeAlertsCount > 0 && (
          <div className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-sm flex items-center gap-1 animate-pulse">
            <AlertTriangle className="size-4" />
            {activeAlertsCount}
          </div>
        )}
      </div>

      <p className="text-slate-500 text-sm">مرتّبة حسب مستوى الخطورة</p>
    </div>

    {/* قائمة التنبيهات - Scroll */}
    <div className="flex-1 overflow-y-auto">
      {Object.entries(groupedAlerts).map(([districtName, districtAlerts]) => (
        <div key={districtName} className="border-b border-slate-200 last:border-b-0">

          {/* عنوان الحي */}
          <div className="bg-slate-50 px-6 py-2 sticky top-0 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 text-sm">{districtName}</span>
              <span className="text-slate-500 text-xs">
                {
                  districtAlerts.filter(
                    a => !a.acknowledged && !acknowledgedAlerts.has(a.id)
                  ).length
                } فعال
              </span>
            </div>
          </div>

          {/* قائمة تنبيهات الحي */}
          <div className="divide-y divide-slate-100">
            {districtAlerts.map((alert) => {
              const isAcknowledged =
                alert.acknowledged || acknowledgedAlerts.has(alert.id);

              return (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    isAcknowledged ? 'opacity-50' : ''
                  }`}
                  onClick={() => onRoundaboutSelect(alert.roundaboutId)}
                >
                  {/* رأس التنبيه */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2 flex-1">

                      <div
                        className={`mt-0.5 ${getSeverityBgColor(alert.severity)} ${getSeverityColor(alert.severity)} p-1.5 rounded`}
                      >
                        {alert.type === 'congestion' && <AlertTriangle className="size-4" />}
                        {alert.type === 'risky_behavior' && <AlertIcon className="size-4" />}
                        {alert.type === 'equipment' && <AlertTriangle className="size-4" />}
                        {alert.type === 'accident' && <AlertTriangle className="size-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${getSeverityBgColor(alert.severity)} ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>

                          <span className="text-slate-900 text-xs">
                            الدرجة: {alert.severityScore}
                          </span>
                        </div>

                        <div className="text-slate-900 text-sm">{alert.roundaboutName}</div>
                      </div>
                    </div>

                    {isAcknowledged && (
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>

                  {/* رسالة التنبيه */}
                  <div className="mr-9 mb-2">
                    <p className="text-slate-600 text-sm">{alert.message}</p>
                  </div>

                  {/* الأثر والوقت */}
                  <div className="mr-9 flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      <span>{alert.estimatedImpact}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>

                  {/* الأزرار */}
                  {!isAcknowledged && (
                    <div className="mr-9 flex items-center gap-2">
                      <button
                        onClick={(e) => handleDispatch(alert.id, e)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="size-3" />
                        إرسال فريق
                      </button>

                      <button
                        onClick={(e) => handleAcknowledge(alert.id, e)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="size-3" />
                        تأكيد
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    {/* الفوتر */}
    <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
      <div className="flex items-center justify-between text-sm">

        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-slate-600">المراقبة اللحظية فعّالة</span>
        </div>

        <button className="text-blue-600 hover:text-blue-700">
          عرض الكل
        </button>

      </div>
    </div>
  </div>
);
}