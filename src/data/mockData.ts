export type SeverityLevel = 'optimal' | 'attention' | 'concern' | 'critical';
export type CongestionLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface RiskyBehavior {
  wrongWay: number;
  illegalUTurn: number;
  speeding: number;
}

export interface Roundabout {
  id: string;
  name: string;
  districtId: string;
  vehicleEntry: number;
  vehicleExit: number;
  entryTrend: 'up' | 'down' | 'stable';
  exitTrend: 'up' | 'down' | 'stable';
  laneUtilization: number;
  congestionLevel: CongestionLevel;
  riskyBehaviors: RiskyBehavior;
  lastUpdated: Date;
  severityScore: number;
  latitude: number;
  longitude: number;
}

export interface District {
  id: string;
  name: string;
  nameAr: string;
  totalRoundabouts: number;
  activeAlerts: number;
  congestionScore: number;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
}

export interface Alert {
  id: string;
  roundaboutId: string;
  roundaboutName: string;
  districtId: string;
  districtName: string;
  severity: SeverityLevel;
  type: 'congestion' | 'risky_behavior' | 'equipment' | 'accident';
  message: string;
  estimatedImpact: string;
  timestamp: Date;
  acknowledged: boolean;
  severityScore: number;
}

export const districts: District[] = [
  {
    id: 'north',
    name: 'شمال الرياض',
    nameAr: 'المنطقة الشمالية',
    totalRoundabouts: 12,
    activeAlerts: 3,
    congestionScore: 72,
    severity: 'concern',
    latitude: 24.8,
    longitude: 46.7,
  },
  {
    id: 'south',
    name: 'جنوب الرياض',
    nameAr: 'المنطقة الجنوبية',
    totalRoundabouts: 8,
    activeAlerts: 1,
    congestionScore: 45,
    severity: 'attention',
    latitude: 24.6,
    longitude: 46.7,
  },
  {
    id: 'east',
    name: 'شرق الرياض',
    nameAr: 'المنطقة الشرقية',
    totalRoundabouts: 11,
    activeAlerts: 5,
    congestionScore: 88,
    severity: 'critical',
    latitude: 24.7,
    longitude: 46.8,
  },
  {
    id: 'west',
    name: 'غرب الرياض',
    nameAr: 'المنطقة الغربية',
    totalRoundabouts: 9,
    activeAlerts: 0,
    congestionScore: 28,
    severity: 'optimal',
    latitude: 24.7,
    longitude: 46.6,
  },
  {
    id: 'central',
    name: 'وسط الرياض',
    nameAr: 'المنطقة الوسطى',
    totalRoundabouts: 5,
    activeAlerts: 2,
    congestionScore: 65,
    severity: 'concern',
    latitude: 24.7,
    longitude: 46.7,
  },
];

export const roundabouts: Roundabout[] = [
  // Northern District
  {
    id: 'n-001',
    name: 'King Fahd Rd & Olaya St',
    districtId: 'north',
    vehicleEntry: 1245,
    vehicleExit: 1189,
    entryTrend: 'up',
    exitTrend: 'stable',
    laneUtilization: 78,
    congestionLevel: 'High',
    riskyBehaviors: { wrongWay: 3, illegalUTurn: 7, speeding: 12 },
    lastUpdated: new Date(Date.now() - 45000),
    severityScore: 75,
    latitude: 24.81,
    longitude: 46.7,
  },
  {
    id: 'n-002',
    name: 'Northern Ring Rd & Exit 9',
    districtId: 'north',
    vehicleEntry: 892,
    vehicleExit: 905,
    entryTrend: 'down',
    exitTrend: 'down',
    laneUtilization: 65,
    congestionLevel: 'Moderate',
    riskyBehaviors: { wrongWay: 1, illegalUTurn: 3, speeding: 8 },
    lastUpdated: new Date(Date.now() - 32000),
    severityScore: 52,
    latitude: 24.82,
    longitude: 46.68,
  },
  {
    id: 'n-003',
    name: 'Al Takhassusi & King Abdul Aziz',
    districtId: 'north',
    vehicleEntry: 1567,
    vehicleExit: 1523,
    entryTrend: 'up',
    exitTrend: 'up',
    laneUtilization: 92,
    congestionLevel: 'Critical',
    riskyBehaviors: { wrongWay: 5, illegalUTurn: 11, speeding: 18 },
    lastUpdated: new Date(Date.now() - 28000),
    severityScore: 95,
    latitude: 24.79,
    longitude: 46.69,
  },
  // Eastern District
  {
    id: 'e-001',
    name: 'Khurais Rd & Airport Rd',
    districtId: 'east',
    vehicleEntry: 2103,
    vehicleExit: 1987,
    entryTrend: 'up',
    exitTrend: 'stable',
    laneUtilization: 95,
    congestionLevel: 'Critical',
    riskyBehaviors: { wrongWay: 8, illegalUTurn: 15, speeding: 22 },
    lastUpdated: new Date(Date.now() - 51000),
    severityScore: 98,
    latitude: 24.71,
    longitude: 46.82,
  },
  {
    id: 'e-002',
    name: 'Dammam Hwy & Industrial Area',
    districtId: 'east',
    vehicleEntry: 1678,
    vehicleExit: 1702,
    entryTrend: 'stable',
    exitTrend: 'up',
    laneUtilization: 87,
    congestionLevel: 'High',
    riskyBehaviors: { wrongWay: 4, illegalUTurn: 9, speeding: 14 },
    lastUpdated: new Date(Date.now() - 39000),
    severityScore: 82,
    latitude: 24.69,
    longitude: 46.81,
  },
  // Southern District
  {
    id: 's-001',
    name: 'Makkah Rd & Southern Ring',
    districtId: 'south',
    vehicleEntry: 734,
    vehicleExit: 756,
    entryTrend: 'stable',
    exitTrend: 'stable',
    laneUtilization: 54,
    congestionLevel: 'Moderate',
    riskyBehaviors: { wrongWay: 2, illegalUTurn: 4, speeding: 6 },
    lastUpdated: new Date(Date.now() - 41000),
    severityScore: 48,
    latitude: 24.61,
    longitude: 46.71,
  },
  {
    id: 's-002',
    name: 'Wadi Hanifa & Al Hayer',
    districtId: 'south',
    vehicleEntry: 456,
    vehicleExit: 478,
    entryTrend: 'down',
    exitTrend: 'down',
    laneUtilization: 42,
    congestionLevel: 'Low',
    riskyBehaviors: { wrongWay: 0, illegalUTurn: 1, speeding: 3 },
    lastUpdated: new Date(Date.now() - 55000),
    severityScore: 25,
    latitude: 24.59,
    longitude: 46.69,
  },
  // Western District
  {
    id: 'w-001',
    name: 'Madinah Rd & Exit 12',
    districtId: 'west',
    vehicleEntry: 623,
    vehicleExit: 601,
    entryTrend: 'stable',
    exitTrend: 'stable',
    laneUtilization: 48,
    congestionLevel: 'Low',
    riskyBehaviors: { wrongWay: 1, illegalUTurn: 2, speeding: 4 },
    lastUpdated: new Date(Date.now() - 35000),
    severityScore: 32,
    latitude: 24.71,
    longitude: 46.61,
  },
  {
    id: 'w-002',
    name: 'King Khalid Rd & Industrial',
    districtId: 'west',
    vehicleEntry: 512,
    vehicleExit: 534,
    entryTrend: 'down',
    exitTrend: 'stable',
    laneUtilization: 39,
    congestionLevel: 'Low',
    riskyBehaviors: { wrongWay: 0, illegalUTurn: 1, speeding: 2 },
    lastUpdated: new Date(Date.now() - 47000),
    severityScore: 22,
    latitude: 24.69,
    longitude: 46.62,
  },
  // Central District
  {
    id: 'c-001',
    name: 'King Fahd & Olaya Intersection',
    districtId: 'central',
    vehicleEntry: 1432,
    vehicleExit: 1398,
    entryTrend: 'up',
    exitTrend: 'stable',
    laneUtilization: 73,
    congestionLevel: 'High',
    riskyBehaviors: { wrongWay: 3, illegalUTurn: 8, speeding: 11 },
    lastUpdated: new Date(Date.now() - 29000),
    severityScore: 71,
    latitude: 24.71,
    longitude: 46.69,
  },
  {
    id: 'c-002',
    name: 'Al Malaz & King Abdullah',
    districtId: 'central',
    vehicleEntry: 987,
    vehicleExit: 1012,
    entryTrend: 'stable',
    exitTrend: 'up',
    laneUtilization: 61,
    congestionLevel: 'Moderate',
    riskyBehaviors: { wrongWay: 1, illegalUTurn: 4, speeding: 7 },
    lastUpdated: new Date(Date.now() - 38000),
    severityScore: 55,
    latitude: 24.69,
    longitude: 46.71,
  },
];

export const alerts: Alert[] = [
  {
    id: 'a-001',
    roundaboutId: 'e-001',
    roundaboutName: 'Khurais Rd & Airport Rd',
    districtId: 'east',
    districtName: 'Eastern District',
    severity: 'critical',
    type: 'congestion',
    message: 'Critical congestion detected - 95% lane utilization',
    estimatedImpact: '20-minute average delay',
    timestamp: new Date(Date.now() - 120000),
    acknowledged: false,
    severityScore: 98,
  },
  {
    id: 'a-002',
    roundaboutId: 'n-003',
    roundaboutName: 'Al Takhassusi & King Abdul Aziz',
    districtId: 'north',
    districtName: 'Northern District',
    severity: 'critical',
    type: 'risky_behavior',
    message: 'High risky behavior count - 34 violations detected',
    estimatedImpact: 'Accident risk elevated',
    timestamp: new Date(Date.now() - 180000),
    acknowledged: false,
    severityScore: 95,
  },
  {
    id: 'a-003',
    roundaboutId: 'e-002',
    roundaboutName: 'Dammam Hwy & Industrial Area',
    districtId: 'east',
    districtName: 'Eastern District',
    severity: 'concern',
    type: 'congestion',
    message: 'High congestion - 87% lane utilization',
    estimatedImpact: '12-minute average delay',
    timestamp: new Date(Date.now() - 240000),
    acknowledged: false,
    severityScore: 82,
  },
  {
    id: 'a-004',
    roundaboutId: 'n-001',
    roundaboutName: 'King Fahd Rd & Olaya St',
    districtId: 'north',
    districtName: 'Northern District',
    severity: 'concern',
    type: 'congestion',
    message: 'Increasing traffic volume with 22 violations',
    estimatedImpact: '8-minute average delay',
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
    severityScore: 75,
  },
  {
    id: 'a-005',
    roundaboutId: 'c-001',
    roundaboutName: 'King Fahd & Olaya Intersection',
    districtId: 'central',
    districtName: 'Central District',
    severity: 'concern',
    type: 'risky_behavior',
    message: 'Multiple violations detected - 22 total incidents',
    estimatedImpact: 'Monitor for escalation',
    timestamp: new Date(Date.now() - 360000),
    acknowledged: false,
    severityScore: 71,
  },
  {
    id: 'a-006',
    roundaboutId: 's-001',
    roundaboutName: 'Makkah Rd & Southern Ring',
    districtId: 'south',
    districtName: 'Southern District',
    severity: 'attention',
    type: 'congestion',
    message: 'Moderate congestion - monitor closely',
    estimatedImpact: '5-minute average delay',
    timestamp: new Date(Date.now() - 420000),
    acknowledged: true,
    severityScore: 48,
  },
];

// Helper function to get severity color
export function getSeverityColor(severity: SeverityLevel): string {
  const colors = {
    optimal: 'text-green-600',
    attention: 'text-yellow-600',
    concern: 'text-orange-600',
    critical: 'text-red-600',
  };
  return colors[severity];
}

export function getSeverityBgColor(severity: SeverityLevel): string {
  const colors = {
    optimal: 'bg-green-100',
    attention: 'bg-yellow-100',
    concern: 'bg-orange-100',
    critical: 'bg-red-100',
  };
  return colors[severity];
}

export function getSeverityBorderColor(severity: SeverityLevel): string {
  const colors = {
    optimal: 'border-green-500',
    attention: 'border-yellow-500',
    concern: 'border-orange-500',
    critical: 'border-red-500',
  };
  return colors[severity];
}

export function getCongestionColor(level: CongestionLevel): string {
  const colors = {
    Low: 'text-green-600',
    Moderate: 'text-yellow-600',
    High: 'text-orange-600',
    Critical: 'text-red-600',
  };
  return colors[level];
}

// Helper function to format time ago
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
