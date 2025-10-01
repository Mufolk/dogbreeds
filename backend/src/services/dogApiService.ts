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

  constructor() {
    this.baseURL = process.env.DOG_API_BASE_URL || DOG_API_BASE_URL;
  }

  /**
   * Fetch all dog breeds from Dog CEO API
   * @returns Promise<string[]> - Array of breed names
   */
  async getAllBreeds(): Promise<string[]> {
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
          // No sub-breeds, just add the main breed
          breedNames.push(breed);
        } else {
          // Has sub-breeds, add each combination
          subBreeds.forEach(subBreed => {
            breedNames.push(`${breed}-${subBreed}`);
          });
          // Also add the main breed
          breedNames.push(breed);
        }
      });

      return breedNames.sort();
    } catch (error) {
      Logger.error('Error fetching breeds:', error);
      throw new Error('Failed to fetch dog breeds');
    }
  }

  /**
   * Fetch random images for a specific breed
   * @param breed - The breed name
   * @param count - Number of images to fetch (default: 3)
   * @returns Promise<string[]> - Array of image URLs
   */
  async getBreedImages(breed: string, count: number = 3): Promise<string[]> {
    try {
      // Handle sub-breeds (format: "breed-subbreed")
      const breedPath = breed.includes('-') 
        ? breed.replace('-', '/') 
        : breed;

      const response = await axios.get<DogApiResponse<string[]>>(
        `${this.baseURL}/breed/${breedPath}/images/random/${count}`
      );

      if (response.data.status !== 'success') {
        throw new Error(`Failed to fetch images for breed: ${breed}`);
      }

      return response.data.message;
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