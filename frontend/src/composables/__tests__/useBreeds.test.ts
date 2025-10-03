import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useBreeds } from '../useBreeds';
import apiService from '@/services/api';

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    getAllBreeds: vi.fn(),
    getBreedImages: vi.fn(),
    getFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

const mockApiService = apiService as any;

describe('useBreeds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty state', () => {
    const { breeds, favorites, loading, error, totalBreeds, totalFavorites } = useBreeds();

    expect(breeds.value).toEqual([]);
    expect(favorites.value).toEqual([]);
    expect(loading.value).toEqual({
      breeds: false,
      images: false,
      favorites: false,
    });
    expect(error.value).toBeNull();
    expect(totalBreeds.value).toBe(0);
    expect(totalFavorites.value).toBe(0);
  });

  describe('fetchAllBreeds', () => {
    it('should fetch and transform breeds successfully', async () => {
      const mockBreeds = ['bulldog', 'retriever', 'husky'];
      mockApiService.getAllBreeds.mockResolvedValue(mockBreeds);

      const { fetchAllBreeds, breeds, loading } = useBreeds();

      await fetchAllBreeds();

      expect(loading.value.breeds).toBe(false);
      expect(breeds.value).toHaveLength(3);
      expect(breeds.value[0]).toEqual({
        id: 'bulldog',
        name: 'bulldog',
        displayName: 'Bulldog',
        subBreeds: [],
        isFavorite: false,
        images: [],
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockApiService.getAllBreeds.mockRejectedValue(new Error(errorMessage));

      const { fetchAllBreeds, error, loading } = useBreeds();

      await fetchAllBreeds();

      expect(loading.value.breeds).toBe(false);
      expect(error.value).toEqual({
        message: 'Failed to load dog breeds. Please try again.',
        type: 'error',
      });
      expect(console.error).toHaveBeenCalledWith('Error fetching breeds: ', expect.any(Error));
    });

    it('should set loading state correctly', async () => {
      let resolvePromise: (value: string[]) => void;
      const promise = new Promise<string[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockApiService.getAllBreeds.mockReturnValue(promise);

      const { fetchAllBreeds, loading } = useBreeds();

      const fetchPromise = fetchAllBreeds();
      expect(loading.value.breeds).toBe(true);

      resolvePromise!(['bulldog']);
      await fetchPromise;

      expect(loading.value.breeds).toBe(false);
    });

    it('should clear error before fetching', async () => {
      const { setError, fetchAllBreeds, error } = useBreeds();
      
      setError('Previous error');
      expect(error.value).not.toBeNull();

      mockApiService.getAllBreeds.mockResolvedValue(['bulldog']);
      await fetchAllBreeds();

      expect(error.value).toBeNull();
    });
  });

  describe('fetchBreedImages', () => {
    it('should fetch and update breed images', async () => {
      const mockImages = ['image1.jpg', 'image2.jpg'];
      mockApiService.getBreedImages.mockResolvedValue(mockImages);

      const { fetchBreedImages, breeds, loading } = useBreeds();
      
      // First add a breed
      breeds.value = [{
        id: 'bulldog',
        name: 'bulldog',
        displayName: 'Bulldog',
        subBreeds: [],
        isFavorite: false,
        images: [],
      }];

      const result = await fetchBreedImages('bulldog');

      expect(loading.value.images).toBe(false);
      expect(result).toEqual(mockImages);
      expect(breeds.value[0].images).toEqual(mockImages);
    });

    it('should handle breed not found', async () => {
      mockApiService.getBreedImages.mockResolvedValue(['image1.jpg']);

      const { fetchBreedImages, breeds } = useBreeds();
      
      breeds.value = [{
        id: 'bulldog',
        name: 'bulldog',
        displayName: 'Bulldog',
        subBreeds: [],
        isFavorite: false,
        images: [],
      }];

      const result = await fetchBreedImages('nonexistent');

      expect(result).toEqual(['image1.jpg']);
      expect(breeds.value[0].images).toEqual([]);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Image fetch failed';
      mockApiService.getBreedImages.mockRejectedValue(new Error(errorMessage));

      const { fetchBreedImages, error, loading } = useBreeds();

      const result = await fetchBreedImages('bulldog');

      expect(loading.value.images).toBe(false);
      expect(result).toEqual([]);
      expect(error.value).toEqual({
        message: 'Failed to load images for bulldog. Please try again.',
        type: 'error',
      });
      expect(console.error).toHaveBeenCalledWith('Error fetching breed images:', expect.any(Error));
    });
  });

  describe('fetchFavorites', () => {
    it('should fetch and update favorites', async () => {
      const mockFavorites = ['bulldog', 'retriever'];
      mockApiService.getFavorites.mockResolvedValue(mockFavorites);

      const { fetchFavorites, favorites, breeds, loading } = useBreeds();
      
      breeds.value = [
        { id: 'bulldog', name: 'bulldog', displayName: 'Bulldog', subBreeds: [], isFavorite: false, images: [] },
        { id: 'retriever', name: 'retriever', displayName: 'Retriever', subBreeds: [], isFavorite: false, images: [] },
      ];

      await fetchFavorites();

      expect(loading.value.favorites).toBe(false);
      expect(favorites.value).toEqual(mockFavorites);
      expect(breeds.value[0].isFavorite).toBe(true);
      expect(breeds.value[1].isFavorite).toBe(true);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Favorites fetch failed';
      mockApiService.getFavorites.mockRejectedValue(new Error(errorMessage));

      const { fetchFavorites, error, loading } = useBreeds();

      await fetchFavorites();

      expect(loading.value.favorites).toBe(false);
      expect(error.value).toEqual({
        message: 'Failed to load favorites. Please try again.',
        type: 'error',
      });
      expect(console.error).toHaveBeenCalledWith('Error fetching favorites:', expect.any(Error));
    });
  });

  describe('toggleFavorite', () => {
    it('should add favorite when not in favorites', async () => {
      mockApiService.addFavorite.mockResolvedValue(undefined);

      const { toggleFavorite, favorites, breeds } = useBreeds();
      
      breeds.value = [{
        id: 'bulldog',
        name: 'bulldog',
        displayName: 'Bulldog',
        subBreeds: [],
        isFavorite: false,
        images: [],
      }];

      await toggleFavorite('bulldog');

      expect(mockApiService.addFavorite).toHaveBeenCalledWith('bulldog');
      expect(favorites.value).toContain('bulldog');
      expect(breeds.value[0].isFavorite).toBe(true);
    });

    it('should remove favorite when in favorites', async () => {
      mockApiService.removeFavorite.mockResolvedValue(undefined);

      const { toggleFavorite, favorites, breeds } = useBreeds();
      
      favorites.value = ['bulldog'];
      breeds.value = [{
        id: 'bulldog',
        name: 'bulldog',
        displayName: 'Bulldog',
        subBreeds: [],
        isFavorite: true,
        images: [],
      }];

      await toggleFavorite('bulldog');

      expect(mockApiService.removeFavorite).toHaveBeenCalledWith('bulldog');
      expect(favorites.value).not.toContain('bulldog');
      expect(breeds.value[0].isFavorite).toBe(false);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Toggle failed';
      mockApiService.addFavorite.mockRejectedValue(new Error(errorMessage));

      const { toggleFavorite, error } = useBreeds();

      await toggleFavorite('bulldog');

      expect(error.value).toEqual({
        message: 'Failed to update favorite status for bulldog.',
        type: 'error',
      });
      expect(console.error).toHaveBeenCalledWith('Error toggling favorite:', expect.any(Error));
    });

    it('should set info message on successful toggle', async () => {
      mockApiService.addFavorite.mockResolvedValue(undefined);

      const { toggleFavorite, error } = useBreeds();

      await toggleFavorite('bulldog');

      expect(error.value).toEqual({
        message: 'bulldog added to favorites!',
        type: 'info',
      });
    });

    it('should clear info message after timeout', async () => {
      vi.useFakeTimers();
      mockApiService.addFavorite.mockResolvedValue(undefined);

      const { toggleFavorite, error, clearError } = useBreeds();

      await toggleFavorite('bulldog');

      expect(error.value).not.toBeNull();

      vi.advanceTimersByTime(3000);

      expect(error.value).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('computed properties', () => {
    it('should compute favoriteBreeds correctly', () => {
      const { breeds, favorites, favoriteBreeds } = useBreeds();
      
      breeds.value = [
        { id: 'bulldog', name: 'bulldog', displayName: 'Bulldog', subBreeds: [], isFavorite: false, images: [] },
        { id: 'retriever', name: 'retriever', displayName: 'Retriever', subBreeds: [], isFavorite: false, images: [] },
      ];
      favorites.value = ['bulldog'];

      expect(favoriteBreeds.value).toHaveLength(1);
      expect(favoriteBreeds.value[0].name).toBe('bulldog');
    });

    it('should compute totalBreeds correctly', () => {
      const { breeds, totalBreeds } = useBreeds();
      
      breeds.value = [
        { id: 'bulldog', name: 'bulldog', displayName: 'Bulldog', subBreeds: [], isFavorite: false, images: [] },
        { id: 'retriever', name: 'retriever', displayName: 'Retriever', subBreeds: [], isFavorite: false, images: [] },
      ];

      expect(totalBreeds.value).toBe(2);
    });

    it('should compute totalFavorites correctly', () => {
      const { favorites, totalFavorites } = useBreeds();
      
      favorites.value = ['bulldog', 'retriever'];

      expect(totalFavorites.value).toBe(2);
    });
  });

  describe('error handling', () => {
    it('should set error with custom type', () => {
      const { setError, error } = useBreeds();

      setError('Warning message', 'warning');

      expect(error.value).toEqual({
        message: 'Warning message',
        type: 'warning',
      });
    });

    it('should clear error', () => {
      const { setError, clearError, error } = useBreeds();

      setError('Test error');
      expect(error.value).not.toBeNull();

      clearError();
      expect(error.value).toBeNull();
    });
  });
});
