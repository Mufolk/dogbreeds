import type { AddFavoriteRequest } from "@/types/breed";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: apiBaseUrl,
            timeout: 10000, //in ms
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.setupInterceptors();
    };

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
                return config;
            },
            (error) => {
                console.error('Request error', error);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error('Response error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        )
    }

    async getAllBreeds(): Promise<string[]> {
        try {
            const response: AxiosResponse<string[]> = await this.client.get('/breeds')
            return response.data;
        } catch (error) {
            console.log('Error fetching breeds: ', error);
            throw error;
        }
    }

    async getBreedImages(breed: string): Promise<string[]> {
        try {
            // Use backticks here for proper template string
            const response: AxiosResponse<string[]> = await this.client.get(`/breeds/${breed}/images`)
            return response.data;
        } catch (error) {
            console.error(`Error fetching images for ${breed}:`, error);
            throw error;
        }
    }

    async getFavorites(): Promise<string[]> {
        try {
            const response: AxiosResponse<string[]> = await this.client.get('/favorites')
            return response.data;
        } catch (error) {
            console.error(`Error fetching favorites`, error);
            throw error;
        }
    }

    async addFavorite(breed: string): Promise<void> {
        try {
            const requestData: AddFavoriteRequest = { breed }; 
            await this.client.post('/favorites', requestData);
        } catch (error) {
            console.error(`Error adding ${breed} to favorites:`, error);
            throw error;
        }
    }

    async removeFavorite(breed: string): Promise<void> {
        try {
            await this.client.delete(`/favorites/${breed}`);
        } catch (error) {
            console.error(`Error removing ${breed} from favorites:`, error);
            throw error;
        }
    }
}

export const apiService = new ApiService();
export default apiService;
