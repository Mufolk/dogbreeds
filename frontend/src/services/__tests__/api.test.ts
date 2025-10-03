import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import apiService from '../api';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('ApiService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('getAllBreeds', () => {
    it('should fetch breeds with default parameters', async () => {
      const mockResponse = {
        data: {
          breeds: ['bulldog', 'retriever'],
          pagination: { currentPage: 1, totalPages: 1, totalBreeds: 2, hasNextPage: false },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getAllBreeds();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds?page=1&limit=30');
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch breeds with custom parameters', async () => {
      const mockResponse = {
        data: {
          breeds: ['bulldog'],
          pagination: { currentPage: 2, totalPages: 2, totalBreeds: 1, hasNextPage: false },
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getAllBreeds(2, 10, 'bulldog');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds?page=2&limit=10&search=bulldog');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiService.getAllBreeds()).rejects.toThrow('Network error');
    });

    it('should handle search with special characters', async () => {
      const mockResponse = { data: { breeds: [], pagination: {} } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getAllBreeds(1, 30, 'bulldog-french');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds?page=1&limit=30&search=bulldog-french');
    });

    it('should handle empty search term', async () => {
      const mockResponse = { data: { breeds: [], pagination: {} } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getAllBreeds(1, 30, '');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds?page=1&limit=30&search=');
    });
  });

  describe('getBreedImages', () => {
    it('should fetch breed images', async () => {
      const mockResponse = {
        data: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getBreedImages('bulldog');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds/bulldog/images');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle breed names with special characters', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getBreedImages('bulldog-french');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds/bulldog-french/images');
    });

    it('should handle breed names with spaces', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getBreedImages('golden retriever');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds/golden retriever/images');
    });

    it('should handle API errors', async () => {
      const error = new Error('Image fetch failed');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiService.getBreedImages('bulldog')).rejects.toThrow('Image fetch failed');
    });

    it('should handle empty breed name', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getBreedImages('');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/breeds//images');
    });
  });

  describe('getFavorites', () => {
    it('should fetch favorites and extract breed names', async () => {
      const mockResponse = {
        data: [
          { breed: 'bulldog', addedAt: '2023-01-01' },
          { breed: 'retriever', addedAt: '2023-01-02' },
        ],
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getFavorites();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/favorites');
      expect(result).toEqual(['bulldog', 'retriever']);
    });

    it('should handle empty favorites', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getFavorites();

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Favorites fetch failed');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiService.getFavorites()).rejects.toThrow('Favorites fetch failed');
    });

    it('should handle malformed response data', async () => {
      const mockResponse = { data: null };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await expect(apiService.getFavorites()).rejects.toThrow();
    });
  });

  describe('addFavorite', () => {
    it('should add favorite successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} });

      await apiService.addFavorite('bulldog');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/favorites', { breed: 'bulldog' });
    });

    it('should handle breed names with special characters', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} });

      await apiService.addFavorite('bulldog-french');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/favorites', { breed: 'bulldog-french' });
    });

    it('should handle empty breed name', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} });

      await apiService.addFavorite('');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/favorites', { breed: '' });
    });

    it('should handle API errors', async () => {
      const error = new Error('Add favorite failed');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(apiService.addFavorite('bulldog')).rejects.toThrow('Add favorite failed');
    });

    it('should handle validation errors', async () => {
      const error = new Error('Invalid breed name');
      error.response = { data: { error: 'Invalid breed name' } };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(apiService.addFavorite('invalid')).rejects.toThrow('Invalid breed name');
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await apiService.removeFavorite('bulldog');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/favorites/bulldog');
    });

    it('should handle breed names with special characters', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await apiService.removeFavorite('bulldog-french');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/favorites/bulldog-french');
    });

    it('should handle breed names with spaces', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await apiService.removeFavorite('golden retriever');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/favorites/golden retriever');
    });

    it('should handle empty breed name', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await apiService.removeFavorite('');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/favorites/');
    });

    it('should handle API errors', async () => {
      const error = new Error('Remove favorite failed');
      mockAxiosInstance.delete.mockRejectedValue(error);

      await expect(apiService.removeFavorite('bulldog')).rejects.toThrow('Remove favorite failed');
    });

    it('should handle breed not found errors', async () => {
      const error = new Error('Breed not found');
      error.response = { data: { error: 'Breed not found' } };
      mockAxiosInstance.delete.mockRejectedValue(error);

      await expect(apiService.removeFavorite('nonexistent')).rejects.toThrow('Breed not found');
    });
  });

  describe('interceptors', () => {
    it('should log request information', () => {
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const config = { method: 'get', url: '/test' };

      const result = requestInterceptor(config);

      expect(result).toEqual(config);
    });

    it('should handle request errors', () => {
      const requestErrorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const error = new Error('Request error');

      expect(() => requestErrorHandler(error)).toThrow('Request error');
    });

    it('should return response as-is', () => {
      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
      const response = { data: 'test' };

      const result = responseInterceptor(response);

      expect(result).toEqual(response);
    });

    it('should handle response errors', () => {
      const responseErrorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = new Error('Response error');
      error.response = { data: { message: 'API Error' } };

      expect(() => responseErrorHandler(error)).toThrow('Response error');
    });

    it('should handle response errors without response data', () => {
      const responseErrorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = new Error('Network error');

      expect(() => responseErrorHandler(error)).toThrow('Network error');
    });
  });

  describe('environment configuration', () => {
    it('should use default base URL when VITE_API_BASE_URL is not set', () => {
      const originalEnv = process.env.VITE_API_BASE_URL;
      delete process.env.VITE_API_BASE_URL;

      // Re-import to test with new env
      vi.resetModules();
      require('../api');

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:3001/api',
        })
      );

      process.env.VITE_API_BASE_URL = originalEnv;
    });

    it('should use custom base URL when VITE_API_BASE_URL is set', () => {
      const originalEnv = process.env.VITE_API_BASE_URL;
      process.env.VITE_API_BASE_URL = 'https://api.example.com';

      // Re-import to test with new env
      vi.resetModules();
      require('../api');

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.example.com',
        })
      );

      process.env.VITE_API_BASE_URL = originalEnv;
    });
  });
});
