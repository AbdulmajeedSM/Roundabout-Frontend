import { useState, useEffect } from 'react';
import { Car, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { apiService, RoundaboutCarsResponse } from '../services/api';

interface TestRoundaboutProps {
    roundaboutId?: string;
}

export function TestRoundabout({ roundaboutId = 'test-001' }: TestRoundaboutProps) {
    const [carData, setCarData] = useState<RoundaboutCarsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchCarData = async () => {
        try {
            const data = await apiService.getRoundaboutCars(roundaboutId);
            setCarData(data);
            setLastUpdate(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch car data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchCarData();

        // Poll every 5 seconds
        const interval = setInterval(fetchCarData, 5000);

        return () => clearInterval(interval);
    }, [roundaboutId]);

    if (loading && !carData) {
        return (
            <div className="flex items-center justify-center p-12">
                <RefreshCw className="size-8 animate-spin text-blue-500" />
                <span className="ml-3 text-slate-600">Loading roundabout data...</span>
            </div>
        );
    }

    if (error && !carData) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="size-6 text-red-600" />
                    <div>
                        <h3 className="text-red-900 font-semibold">Error Loading Data</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                        <p className="text-red-600 text-xs mt-2">
                            Make sure the Flask API is running at http://localhost:5000
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const summary = carData?.summary;
    const cars = carData?.cars || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Test Roundabout - Live Detection</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-4" />
                        <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
                        {error && (
                            <span className="ml-3 text-red-600 flex items-center gap-1">
                                <AlertTriangle className="size-4" />
                                Connection issue
                            </span>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="size-5 text-blue-600" />
                            <span className="text-sm text-blue-700 font-medium">Total Cars</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">{summary?.totalCars || 0}</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="size-5 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">First Zone</span>
                        </div>
                        <div className="text-3xl font-bold text-green-900">{summary?.firstZoneCount || 0}</div>
                        <div className="text-xs text-green-600 mt-1">Priority Area</div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="size-5 text-yellow-600" />
                            <span className="text-sm text-yellow-700 font-medium">Second Zone</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-900">{summary?.secondZoneCount || 0}</div>
                        <div className="text-xs text-yellow-600 mt-1">Yield Area</div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="size-5 text-red-600" />
                            <span className="text-sm text-red-700 font-medium">Penalties</span>
                        </div>
                        <div className="text-3xl font-bold text-red-900">{summary?.penaltyCount || 0}</div>
                        <div className="text-xs text-red-600 mt-1">Violations</div>
                    </div>
                </div>

                {/* Car Types Breakdown */}
                {summary?.carTypes && Object.keys(summary.carTypes).length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Vehicle Types</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(summary.carTypes).map(([type, count]) => (
                                <div
                                    key={type}
                                    className="bg-slate-100 rounded-lg px-4 py-2 border border-slate-200"
                                >
                                    <span className="text-slate-900 font-medium capitalize">{type}: </span>
                                    <span className="text-slate-700">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Cars List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Cars in Roundabout ({cars.length})
                </h3>

                {cars.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Car className="size-12 mx-auto mb-3 opacity-30" />
                        <p>No cars detected in the roundabout</p>
                        <p className="text-sm mt-1">Waiting for vehicles to enter...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cars.map((car) => (
                            <div
                                key={car.id}
                                className={`p-4 rounded-lg border-2 ${car.isPenalty
                                        ? 'bg-red-50 border-red-300'
                                        : car.inFirstZone
                                            ? 'bg-green-50 border-green-300'
                                            : car.inSecondZone
                                                ? 'bg-yellow-50 border-yellow-300'
                                                : 'bg-slate-50 border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Car
                                            className={`size-6 ${car.isPenalty
                                                    ? 'text-red-600'
                                                    : car.inFirstZone
                                                        ? 'text-green-600'
                                                        : car.inSecondZone
                                                            ? 'text-yellow-600'
                                                            : 'text-slate-600'
                                                }`}
                                        />
                                        <div>
                                            <div className="font-semibold text-slate-900 capitalize">
                                                {car.type}
                                                {car.isPenalty && (
                                                    <span className="ml-2 text-red-600 font-bold">⚠ PENALTY</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                ID: {car.id} • Confidence: {(car.confidence * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right text-sm">
                                        <div className="text-slate-700">
                                            Position: ({car.position.x}, {car.position.y})
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            {car.inFirstZone && (
                                                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
                                                    First Zone
                                                </span>
                                            )}
                                            {car.inSecondZone && (
                                                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">
                                                    Second Zone
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="size-5" />
                    How It Works
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                    <p>
                        <strong>First Zone (Green):</strong> Priority area - cars here have the right of way
                    </p>
                    <p>
                        <strong>Second Zone (Yellow):</strong> Yield area - cars must wait for first zone to clear
                    </p>
                    <p>
                        <strong>Penalty (Red):</strong> Triggered when a car enters the second zone while the first zone is occupied
                    </p>
                    <p className="mt-3 pt-3 border-t border-blue-300">
                        <strong>Note:</strong> This is a test roundabout with simulated data. Connect your detection system to see real-time vehicle tracking.
                    </p>
                </div>
            </div>
        </div>
    );
}
