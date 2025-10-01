import axios from 'axios';
import { Logger } from '../utils/logger';

const DOG_API_BASE_URL = 'https://dog.ceo/api';

export interface DogApiResponse<T> {
  message: T;
  status: string;
}

export interface BreedsListResponse {
  [breed: string]: string[];
}

export class DogApiService {
  private baseURL: string;

  // Caching properties
  private breedsCache: string[] | null = null;
  private breedImagesCache: Map<string, { images: string[], expiry: number }> = new Map();
  private CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes cache duration

  constructor() {
    this.baseURL = process.env.DOG_API_BASE_URL || DOG_API_BASE_URL;
  }

  /**
   * Fetch all dog breeds from Dog CEO API with caching
   * @returns Promise<string[]> - Array of breed names
   */
  async getAllBreeds(): Promise<string[]> {
    if (this.breedsCache) {
      Logger.debug('Returning breeds list from cache');
      return this.breedsCache;
    }

    try {
      const response = await axios.get<DogApiResponse<BreedsListResponse>>(
        `${this.baseURL}/breeds/list/all`
      );
      
      if (response.data.status !== 'success') {
        throw new Error('Failed to fetch breeds from Dog API');
      }

      // Convert the breeds object to a flat array of breed names
      const breedsObject = response.data.message;
      const breedNames: string[] = [];

      Object.keys(breedsObject).forEach(breed => {
        const subBreeds = breedsObject[breed];
        if (subBreeds.length === 0) {
          breedNames.push(breed);
        } else {
          subBreeds.forEach(subBreed => {
            breedNames.push(`${breed}-${subBreed}`);
          });
          breedNames.push(breed);
        }
      });

      this.breedsCache = breedNames.sort();

      // Cache expires after 5 minutes:
      setTimeout(() => {
        this.breedsCache = null;
        Logger.debug('Breeds cache expired');
      }, this.CACHE_DURATION_MS);

      return this.breedsCache;
    } catch (error) {
      Logger.error('Error fetching breeds:', error);
      throw new Error('Failed to fetch dog breeds');
    }
  }

  /**
   * Fetch random images for a specific breed with caching
   * @param breed - The breed name
   * @param count - Number of images to fetch (default: 3)
   * @returns Promise<string[]> - Array of image URLs
   */
  async getBreedImages(breed: string, count: number = 3): Promise<string[]> {
    const cacheEntry = this.breedImagesCache.get(breed);
    const now = Date.now();

    if (cacheEntry && cacheEntry.expiry > now) {
      Logger.debug(`Returning images for breed "${breed}" from cache`);
      return cacheEntry.images;
    }

    try {
      const breedPath = breed.includes('-') 
        ? breed.replace('-', '/') 
        : breed;

      const response = await axios.get<DogApiResponse<string[]>>(
        `${this.baseURL}/breed/${breedPath}/images/random/${count}`
      );

      if (response.data.status !== 'success') {
        throw new Error(`Failed to fetch images for breed: ${breed}`);
      }

      const images = response.data.message;

      this.breedImagesCache.set(breed, { images, expiry: now + this.CACHE_DURATION_MS });

      return images;
    } catch (error) {
      Logger.error(`Error fetching images for breed ${breed}:`, error);
      throw new Error(`Failed to fetch images for breed: ${breed}`);
    }
  }

  /**
   * Get a single random image for a breed
   * @param breed - The breed name
   * @returns Promise<string> - Single image URL
   */
  async getRandomBreedImage(breed: string): Promise<string> {
    try {
      const breedPath = breed.includes('-') 
        ? breed.replace('-', '/') 
        : breed;

      const response = await axios.get<DogApiResponse<string>>(
        `${this.baseURL}/breed/${breedPath}/images/random`
      );

      if (response.data.status !== 'success') {
        throw new Error(`Failed to fetch image for breed: ${breed}`);
      }

      return response.data.message;
    } catch (error) {
      Logger.error(`Error fetching image for breed ${breed}:`, error);
      throw new Error(`Failed to fetch image for breed: ${breed}`);
    }
  }
}

// Export a singleton instance
export const dogApiService = new DogApiService();