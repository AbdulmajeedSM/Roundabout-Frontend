import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getSeverityColor, getSeverityBgColor, getCongestionColor, District, Roundabout } from '../data/mockData';
import { TimeRange } from '../App';

interface DistrictListProps {
  selectedDistrict: string | null;
  onDistrictSelect: (districtId: string | null) => void;
  onRoundaboutSelect: (roundaboutId: string) => void;
  timeRange: TimeRange;
  districts: District[];
  roundabouts: Roundabout[];
}

type SortField = 'name' | 'roundabouts' | 'alerts' | 'congestion';
type SortOrder = 'asc' | 'desc';

export function DistrictList({ selectedDistrict, onDistrictSelect, onRoundaboutSelect, districts, roundabouts }: DistrictListProps) {
  const [sortField, setSortField] = useState<SortField>('congestion');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedDistricts = [...districts].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'roundabouts':
        comparison = a.totalRoundabouts - b.totalRoundabouts;
        break;
      case 'alerts':
        comparison = a.activeAlerts - b.activeAlerts;
        break;
      case 'congestion':
        comparison = a.congestionScore - b.congestionScore;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-slate-900">District Performance</h2>
        <p className="text-slate-500 text-sm mt-1">
          Click to expand and view roundabouts
        </p>
      </div>

      {/* Sort Controls */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-sm">
        <span className="text-slate-600">Sort by:</span>
        <button
          onClick={() => handleSort('name')}
          className={`px-3 py-1 rounded ${sortField === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('roundabouts')}
          className={`px-3 py-1 rounded ${sortField === 'roundabouts' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          Roundabouts {sortField === 'roundabouts' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('alerts')}
          className={`px-3 py-1 rounded ${sortField === 'alerts' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          Alerts {sortField === 'alerts' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('congestion')}
          className={`px-3 py-1 rounded ${sortField === 'congestion' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          Congestion {sortField === 'congestion' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* District List */}
      <div className="divide-y divide-slate-200">
        {sortedDistricts.map((district) => {
          const isExpanded = selectedDistrict === district.id;
          const districtRoundabouts = roundabouts.filter(r => r.districtId === district.id);

          return (
            <div key={district.id}>
              {/* District Row */}
              <button
                onClick={() => onDistrictSelect(isExpanded ? null : district.id)}
                className="w-full px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
              >
                {/* Expand Icon */}
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="size-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="size-5 text-slate-400" />
                  )}
                </div>

                {/* District Name */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">{district.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${getSeverityBgColor(district.severity)} ${getSeverityColor(district.severity)}`}
                    >
                      {district.severity}
                    </span>
                  </div>
                  <div className="text-slate-500 text-sm mt-0.5">{district.nameAr}</div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-slate-600 text-xs">Roundabouts</div>
                    <div className="text-slate-900 mt-0.5">{district.totalRoundabouts}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-600 text-xs">Alerts</div>
                    <div className="mt-0.5 flex items-center gap-1">
                      <span className={district.activeAlerts > 0 ? 'text-red-600' : 'text-green-600'}>
                        {district.activeAlerts}
                      </span>
                      {district.activeAlerts > 0 && <AlertCircle className="size-3 text-red-600" />}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-600 text-xs">Congestion</div>
                    <div className={`mt-0.5 ${getSeverityColor(district.severity)}`}>
                      {district.congestionScore}%
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Roundabouts */}
              {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-200">
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {districtRoundabouts.map((roundabout) => {
                        const totalRiskyBehaviors = 
                          roundabout.riskyBehaviors.wrongWay +
                          roundabout.riskyBehaviors.illegalUTurn +
                          roundabout.riskyBehaviors.speeding;

                        return (
                          <button
                            key={roundabout.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRoundaboutSelect(roundabout.id);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-slate-900">{roundabout.name}</h4>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${getCongestionColor(roundabout.congestionLevel)} bg-opacity-10`}
                                    style={{
                                      backgroundColor: roundabout.congestionLevel === 'Critical' ? 'rgba(220, 38, 38, 0.1)' :
                                                        roundabout.congestionLevel === 'High' ? 'rgba(234, 88, 12, 0.1)' :
                                                        roundabout.congestionLevel === 'Moderate' ? 'rgba(202, 138, 4, 0.1)' :
                                                        'rgba(22, 163, 74, 0.1)'
                                    }}
                                  >
                                    {roundabout.congestionLevel}
                                  </span>
                                </div>

                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="text-slate-600 text-xs">Entry</div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-slate-900">{roundabout.vehicleEntry}</span>
                                      {roundabout.entryTrend === 'up' && <TrendingUp className="size-3 text-red-500" />}
                                      {roundabout.entryTrend === 'down' && <TrendingDown className="size-3 text-green-500" />}
                                      {roundabout.entryTrend === 'stable' && <Minus className="size-3 text-slate-400" />}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-600 text-xs">Exit</div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-slate-900">{roundabout.vehicleExit}</span>
                                      {roundabout.exitTrend === 'up' && <TrendingUp className="size-3 text-green-500" />}
                                      {roundabout.exitTrend === 'down' && <TrendingDown className="size-3 text-red-500" />}
                                      {roundabout.exitTrend === 'stable' && <Minus className="size-3 text-slate-400" />}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-600 text-xs">Lane Utilization</div>
                                    <div className="mt-0.5">
                                      <span className={roundabout.laneUtilization > 85 ? 'text-red-600' : 'text-slate-900'}>
                                        {roundabout.laneUtilization}%
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-600 text-xs">Risky Behaviors</div>
                                    <div className="mt-0.5">
                                      <span className={totalRiskyBehaviors > 20 ? 'text-red-600' : totalRiskyBehaviors > 10 ? 'text-orange-600' : 'text-slate-900'}>
                                        {totalRiskyBehaviors}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Severity Score Badge */}
                              <div className="flex-shrink-0">
                                <div
                                  className={`size-12 rounded-full flex items-center justify-center ${
                                    roundabout.severityScore >= 90 ? 'bg-red-100 text-red-700' :
                                    roundabout.severityScore >= 70 ? 'bg-orange-100 text-orange-700' :
                                    roundabout.severityScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}
                                >
                                  <span className="text-sm">{roundabout.severityScore}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}