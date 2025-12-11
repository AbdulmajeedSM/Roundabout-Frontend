import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, Car, Navigation } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCongestionColor, formatTimeAgo, Roundabout, District } from '../data/mockData';
import { TimeRange } from '../App';

interface RoundaboutDetailProps {
  roundaboutId: string;
  timeRange: TimeRange;
  onBack: () => void;
  roundabouts: Roundabout[];
  districts: District[];
}

export function RoundaboutDetail({ roundaboutId, timeRange, onBack, roundabouts, districts }: RoundaboutDetailProps) {
  const roundabout = roundabouts.find(r => r.id === roundaboutId);
  const district = roundabout ? districts.find(d => d.id === roundabout.districtId) : null;

  if (!roundabout || !district) {
    return <div>Roundabout not found</div>;
  }

  const totalRiskyBehaviors =
    roundabout.riskyBehaviors.wrongWay +
    roundabout.riskyBehaviors.illegalUTurn +
    roundabout.riskyBehaviors.speeding;

  // Generate mock historical data based on time range
  const generateHistoricalData = () => {
    const dataPoints = timeRange === 'ساعة' ? 12 : timeRange === '4 ساعات' ? 24 : timeRange === 'اليوم' ? 24 : 48;
    const data = [];

    for (let i = dataPoints - 1; i >= 0; i--) {
      const baseEntry = roundabout.vehicleEntry;
      const variation = Math.random() * 0.3 - 0.15;
      const timeLabel = timeRange === 'الأسبوع'
        ? `اليوم ${dataPoints - i}`
        : `${Math.floor((24 - i) % 24)}:00`;

      data.push({
        time: timeLabel,
        entry: Math.floor(baseEntry * (1 + variation)),
        exit: Math.floor(baseEntry * (1 + variation - 0.05)),
        utilization: Math.floor(roundabout.laneUtilization * (1 + variation * 0.5)),
      });
    }

    return data;
  };

  const historicalData = generateHistoricalData();

  // Heatmap data (time of day vs day of week)
  const heatmapData = [
    { day: 'Mon', '6-9': 78, '9-12': 65, '12-15': 58, '15-18': 82, '18-21': 71, '21-24': 45 },
    { day: 'Tue', '6-9': 75, '9-12': 62, '12-15': 55, '15-18': 85, '18-21': 73, '21-24': 42 },
    { day: 'Wed', '6-9': 80, '9-12': 68, '12-15': 60, '15-18': 88, '18-21': 75, '21-24': 48 },
    { day: 'Thu', '6-9': 82, '9-12': 70, '12-15': 62, '15-18': 90, '18-21': 78, '21-24': 50 },
    { day: 'Fri', '6-9': 70, '9-12': 55, '12-15': 48, '15-18': 65, '18-21': 82, '21-24': 75 },
    { day: 'Sat', '6-9': 55, '9-12': 72, '12-15': 85, '15-18': 80, '18-21': 88, '21-24': 70 },
    { day: 'Sun', '6-9': 52, '9-12': 68, '12-15': 78, '15-18': 75, '18-21': 85, '21-24': 65 },
  ];

  const recurringIssues = [
    { issue: 'High congestion during evening rush (15:00-18:00)', frequency: '5 days/week', severity: 'High' },
    { issue: 'Illegal U-turns from eastern entry lane', frequency: '12 times/day', severity: 'Moderate' },
    { issue: 'Lane utilization imbalance (outer > inner)', frequency: 'Continuous', severity: 'Moderate' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-slate-900">{roundabout.name}</h1>
              <span
                className={`px-3 py-1 rounded ${getCongestionColor(roundabout.congestionLevel)} bg-opacity-10`}
                style={{
                  backgroundColor: roundabout.congestionLevel === 'Critical' ? 'rgba(220, 38, 38, 0.1)' :
                    roundabout.congestionLevel === 'High' ? 'rgba(234, 88, 12, 0.1)' :
                      roundabout.congestionLevel === 'Moderate' ? 'rgba(202, 138, 4, 0.1)' :
                        'rgba(22, 163, 74, 0.1)'
                }}
              >
                {roundabout.congestionLevel} Congestion
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Navigation className="size-4" />
                {district.name}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                Updated {formatTimeAgo(roundabout.lastUpdated)}
              </div>
            </div>
          </div>

          {/* Severity Score */}
          <div className="text-center">
            <div
              className={`size-20 rounded-full flex items-center justify-center ${roundabout.severityScore >= 90 ? 'bg-red-100 text-red-700' :
                roundabout.severityScore >= 70 ? 'bg-orange-100 text-orange-700' :
                  roundabout.severityScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                }`}
            >
              <div>
                <div className="text-2xl">{roundabout.severityScore}</div>
                <div className="text-xs">Severity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Vehicle Entries</span>
            {roundabout.entryTrend === 'up' && <TrendingUp className="size-4 text-red-500" />}
            {roundabout.entryTrend === 'down' && <TrendingDown className="size-4 text-green-500" />}
            {roundabout.entryTrend === 'stable' && <Minus className="size-4 text-slate-400" />}
          </div>
          <div className="text-slate-900 text-2xl">{roundabout.vehicleEntry}</div>
          <div className="text-slate-500 text-xs mt-1">Total vehicles</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Vehicle Exits</span>
            {roundabout.exitTrend === 'up' && <TrendingUp className="size-4 text-green-500" />}
            {roundabout.exitTrend === 'down' && <TrendingDown className="size-4 text-red-500" />}
            {roundabout.exitTrend === 'stable' && <Minus className="size-4 text-slate-400" />}
          </div>
          <div className="text-slate-900 text-2xl">{roundabout.vehicleExit}</div>
          <div className="text-slate-500 text-xs mt-1">Total vehicles</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Cars inside Roundabout</span>
            <Car className="size-4 text-slate-400" />
          </div>
          <div className={`text-2xl ${roundabout.laneUtilization > 8 ? 'text-red-600' : 'text-slate-900'}`}>
            {roundabout.laneUtilization}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Current count
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Priority Penalty</span>
            <AlertTriangle className="size-4 text-orange-500" />
          </div>
          <div className={`text-2xl ${totalRiskyBehaviors > 20 ? 'text-red-600' : totalRiskyBehaviors > 10 ? 'text-orange-600' : 'text-slate-900'}`}>
            {totalRiskyBehaviors}
          </div>
          <div className="text-slate-500 text-xs mt-1">
            Violations detected
          </div>
        </div>
      </div>

      {/* Traffic Volume Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Traffic Volume Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="entry" stroke="#3b82f6" strokeWidth={2} name="Entry" />
            <Line type="monotone" dataKey="exit" stroke="#10b981" strokeWidth={2} name="Exit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lane Utilization Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">Lane Utilization Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="utilization" stroke="#f59e0b" fill="#fef3c7" name="Utilization %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risky Behaviors Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">Risky Behavior Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Wrong Way', count: roundabout.riskyBehaviors.wrongWay, fill: '#ef4444' },
              { name: 'Illegal U-Turn', count: roundabout.riskyBehaviors.illegalUTurn, fill: '#f97316' },
              { name: 'Speeding', count: roundabout.riskyBehaviors.speeding, fill: '#f59e0b' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Congestion Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Congestion Heatmap - Time of Day vs Day of Week</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-600">Day</th>
                <th className="text-center py-3 px-4 text-slate-600">6-9 AM</th>
                <th className="text-center py-3 px-4 text-slate-600">9-12 PM</th>
                <th className="text-center py-3 px-4 text-slate-600">12-3 PM</th>
                <th className="text-center py-3 px-4 text-slate-600">3-6 PM</th>
                <th className="text-center py-3 px-4 text-slate-600">6-9 PM</th>
                <th className="text-center py-3 px-4 text-slate-600">9-12 AM</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.day} className="border-b border-slate-100">
                  <td className="py-3 px-4 text-slate-900">{row.day}</td>
                  {['6-9', '9-12', '12-15', '15-18', '18-21', '21-24'].map((timeSlot) => {
                    const value = row[timeSlot as keyof typeof row] as number;
                    const bgColor =
                      value >= 85 ? 'bg-red-500' :
                        value >= 70 ? 'bg-orange-500' :
                          value >= 50 ? 'bg-yellow-500' :
                            'bg-green-500';

                    return (
                      <td key={timeSlot} className="text-center py-3 px-4">
                        <div className={`${bgColor} text-white rounded py-2 px-3 inline-block`}>
                          {value}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recurring Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Top 3 Recurring Issues</h3>
        <div className="space-y-3">
          {recurringIssues.map((issue, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-shrink-0 size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-slate-900 text-sm">{issue.issue}</div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                  <span>Frequency: {issue.frequency}</span>
                  <span className={
                    issue.severity === 'High' ? 'text-red-600' :
                      issue.severity === 'Moderate' ? 'text-orange-600' :
                        'text-yellow-600'
                  }>
                    Severity: {issue.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison to District Average */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Comparison to {district.name} Average</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-slate-600 text-sm mb-2">Lane Utilization</div>
            <div className="flex items-end gap-2">
              <div className="text-slate-900 text-2xl">{roundabout.laneUtilization}%</div>
              <div className="text-slate-500 pb-1">vs {district.congestionScore}%</div>
            </div>
            <div className={`text-sm mt-1 ${roundabout.laneUtilization > district.congestionScore ? 'text-red-600' : 'text-green-600'}`}>
              {roundabout.laneUtilization > district.congestionScore ? '+' : ''}
              {roundabout.laneUtilization - district.congestionScore}% from average
            </div>
          </div>
          <div>
            <div className="text-slate-600 text-sm mb-2">Risky Behaviors</div>
            <div className="flex items-end gap-2">
              <div className="text-slate-900 text-2xl">{totalRiskyBehaviors}</div>
              <div className="text-slate-500 pb-1">vs 15 avg</div>
            </div>
            <div className={`text-sm mt-1 ${totalRiskyBehaviors > 15 ? 'text-red-600' : 'text-green-600'}`}>
              {totalRiskyBehaviors > 15 ? '+' : ''}
              {totalRiskyBehaviors - 15} from average
            </div>
          </div>
          <div>
            <div className="text-slate-600 text-sm mb-2">Severity Score</div>
            <div className="flex items-end gap-2">
              <div className="text-slate-900 text-2xl">{roundabout.severityScore}</div>
              <div className="text-slate-500 pb-1">vs 60 avg</div>
            </div>
            <div className={`text-sm mt-1 ${roundabout.severityScore > 60 ? 'text-red-600' : 'text-green-600'}`}>
              {roundabout.severityScore > 60 ? '+' : ''}
              {roundabout.severityScore - 60} from average
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}