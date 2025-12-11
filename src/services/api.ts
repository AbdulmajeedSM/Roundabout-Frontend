import { Roundabout, District, Alert } from '../data/mockData';

const API_BASE_URL = 'http://localhost:5000/api';

export interface CarInRoundabout {
    id: string;
    type: string;
    confidence: number;
    position: {
        x: number;
        y: number;
    };
    inFirstZone: boolean;
    inSecondZone: boolean;
    isPenalty: boolean;
    timestamp: string;
}

export interface RoundaboutCarsResponse {
    roundaboutId: string;
    timestamp: string;
    summary: {
        totalCars: number;
        penaltyCount: number;
        firstZoneCount: number;
        secondZoneCount: number;
        carTypes: Record<string, number>;
    };
    cars: CarInRoundabout[];
}

class ApiService {
    private async fetchJson<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async getRoundabouts(): Promise<Roundabout[]> {
        const data = await this.fetchJson<any[]>('/roundabouts');
        return data.map(r => ({
            ...r,
            lastUpdated: new Date(r.lastUpdated)
        }));
    }

    async getDistricts(): Promise<District[]> {
        return this.fetchJson<District[]>('/districts');
    }

    async getAlerts(): Promise<Alert[]> {
        const data = await this.fetchJson<any[]>('/alerts');
        return data.map(a => ({
            ...a,
            timestamp: new Date(a.timestamp)
        }));
    }

    async getRoundabout(id: string): Promise<Roundabout> {
        const data = await this.fetchJson<any>(`/roundabout/${id}`);
        return {
            ...data,
            lastUpdated: new Date(data.lastUpdated)
        };
    }

    async getRoundaboutCars(id: string): Promise<RoundaboutCarsResponse> {
        return this.fetchJson<RoundaboutCarsResponse>(`/roundabout/${id}/cars`);
    }

    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.fetchJson<{ status: string; timestamp: string }>('/health');
    }
}

export const apiService = new ApiService();
