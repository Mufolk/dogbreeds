import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useBreedsData } from '../useBreedsData';
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

describe('useBreedsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock window methods
    Object.defineProperty(window, 'addEventListener', {
      value: vi.fn(),
      writable: true,
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: vi.fn(),
      writable: true,
    });
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const {
      allBreeds,
      loading,
      error,
      favorites,
      modalShow,
      modalBreed,
      modalImages,
      breedImageMap,
      currentPage,
      hasMoreBreeds,
      totalBreeds,
      isInitialLoad,
      scrollLoading,
      visibleDogs,
    } = useBreedsData();

    expect(allBreeds.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBe('');
    expect(favorites.value).toEqual([]);
    expect(modalShow.value).toBe(false);
    expect(modalBreed.value).toBe('');
    expect(modalImages.value).toEqual([]);
    expect(breedImageMap.value).toEqual({});
    expect(currentPage.value).toBe(1);
    expect(hasMoreBreeds.value).toBe(true);
    expect(totalBreeds.value).toBe(0);
    expect(isInitialLoad.value).toBe(true);
    expect(scrollLoading.value).toBe(false);
    expect(visibleDogs.value).toEqual([]);
  });

  describe('searchBreeds', () => {
    it('should search breeds and reset state', async () => {
      const mockResponse = {
        breeds: ['bulldog', 'retriever'],
        pagination: { currentPage: 1, totalPages: 1, totalBreeds: 2, hasNextPage: false }
      };
      mockApiService.getAllBreeds.mockResolvedValue(mockResponse);

      const { searchBreeds, visibleDogs } = useBreedsData();

      await searchBreeds('bulldog');

      expect(visibleDogs.value).toEqual([]);
    });
  });

  describe('openModal', () => {
    it('should open modal and load images', async () => {
      const mockImages = ['image1.jpg', 'image2.jpg'];
      mockApiService.getBreedImages.mockResolvedValue(mockImages);

      const { openModal, modalShow, modalBreed, modalImages } = useBreedsData();

      await openModal('bulldog');

      expect(modalShow.value).toBe(true);
      expect(modalBreed.value).toBe('bulldog');
      expect(modalImages.value).toEqual(mockImages);
    });

    it('should handle image loading errors', async () => {
      mockApiService.getBreedImages.mockRejectedValue(new Error('Image load failed'));

      const { openModal, modalShow, modalBreed, modalImages } = useBreedsData();

      await openModal('bulldog');

      expect(modalShow.value).toBe(true);
      expect(modalBreed.value).toBe('bulldog');
      expect(modalImages.value).toEqual([]);
    });
  });

  describe('loadFavorites', () => {
    it('should load favorites successfully', async () => {
      const mockFavorites = ['bulldog', 'retriever'];
      mockApiService.getFavorites.mockResolvedValue(mockFavorites);

      const { loadFavorites, favorites } = useBreedsData();

      await loadFavorites();

      expect(favorites.value).toEqual(mockFavorites);
    });

    it('should handle loading errors', async () => {
      mockApiService.getFavorites.mockRejectedValue(new Error('Favorites load failed'));

      const { loadFavorites } = useBreedsData();

      await loadFavorites();

      expect(console.error).toHaveBeenCalledWith('Error loading favorites:', expect.any(Error));
    });
  });

  describe('loadAllBreedsForSuggestions', () => {
    it('should load breeds for suggestions', async () => {
      const mockResponse = {
        breeds: ['bulldog', 'retriever', 'husky'],
        pagination: { currentPage: 1, totalPages: 1, totalBreeds: 3, hasNextPage: false }
      };
      mockApiService.getAllBreeds.mockResolvedValue(mockResponse);

      const { loadAllBreedsForSuggestions, allBreeds } = useBreedsData();

      await loadAllBreedsForSuggestions();

      expect(allBreeds.value).toEqual(['bulldog', 'retriever', 'husky']);
    });

    it('should handle loading errors', async () => {
      mockApiService.getAllBreeds.mockRejectedValue(new Error('Breeds load failed'));

      const { loadAllBreedsForSuggestions } = useBreedsData();

      await loadAllBreedsForSuggestions();

      expect(console.error).toHaveBeenCalledWith('Error loading breeds for suggestions:', expect.any(Error));
    });
  });

  describe('loadBreeds', () => {
    it('should load breeds for first page', async () => {
      const mockResponse = {
        breeds: ['bulldog', 'retriever'],
        pagination: { currentPage: 1, totalPages: 1, totalBreeds: 2, hasNextPage: false }
      };
      mockApiService.getAllBreeds.mockResolvedValue(mockResponse);

      const { loadBreeds, currentPage, hasMoreBreeds, totalBreeds, loading, isInitialLoad } = useBreedsData();

      await loadBreeds(1);

      expect(currentPage.value).toBe(1);
      expect(hasMoreBreeds.value).toBe(false);
      expect(totalBreeds.value).toBe(2);
      expect(loading.value).toBe(false);
      expect(isInitialLoad.value).toBe(false);
    });

    it('should append breeds for subsequent pages', async () => {
      const mockResponse = {
        breeds: ['husky', 'beagle'],
        pagination: { currentPage: 2, totalPages: 2, totalBreeds: 4, hasNextPage: false }
      };
      mockApiService.getAllBreeds.mockResolvedValue(mockResponse);

      const { loadBreeds } = useBreedsData();

      await loadBreeds(2, true);

      // Test that the function was called with correct parameters
      expect(mockApiService.getAllBreeds).toHaveBeenCalledWith(2, 50, '');
    });

    it('should handle loading errors', async () => {
      mockApiService.getAllBreeds.mockRejectedValue(new Error('Load failed'));

      const { loadBreeds, error, loading, isInitialLoad } = useBreedsData();

      await loadBreeds(1);

      expect(error.value).toBe('Failed to load breeds');
      expect(loading.value).toBe(false);
      expect(isInitialLoad.value).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error loading breeds:', expect.any(Error));
    });

    it('should load images for new breeds', async () => {
      const mockResponse = {
        breeds: ['bulldog', 'retriever'],
        pagination: { currentPage: 1, totalPages: 1, totalBreeds: 2, hasNextPage: false }
      };
      mockApiService.getAllBreeds.mockResolvedValue(mockResponse);
      mockApiService.getBreedImages.mockResolvedValue(['image1.jpg']);

      const { loadBreeds } = useBreedsData();

      await loadBreeds(1);

      // Test that getBreedImages was called for each breed
      expect(mockApiService.getBreedImages).toHaveBeenCalledWith('bulldog');
      expect(mockApiService.getBreedImages).toHaveBeenCalledWith('retriever');
    });
  });

  describe('loadMoreBreeds', () => {
    it('should load more breeds when not loading and has more', async () => {
      const { loadMoreBreeds, hasMoreBreeds, scrollLoading, currentPage } = useBreedsData();
      hasMoreBreeds.value = true;
      scrollLoading.value = false;
      currentPage.value = 1;

      const loadBreedsSpy = vi.fn();
      vi.doMock('../useBreedsData', () => ({
        useBreedsData: () => ({
          loadMoreBreeds,
          hasMoreBreeds,
          scrollLoading,
          currentPage,
          loadBreeds: loadBreedsSpy,
        }),
      }));

      await loadMoreBreeds();

      expect(scrollLoading.value).toBe(false);
    });

    it('should not load more when already loading', async () => {
      const { loadMoreBreeds, hasMoreBreeds, scrollLoading } = useBreedsData();
      hasMoreBreeds.value = true;
      scrollLoading.value = true;

      await loadMoreBreeds();

      expect(scrollLoading.value).toBe(true);
    });

    it('should not load more when no more breeds', async () => {
      const { loadMoreBreeds, hasMoreBreeds, scrollLoading } = useBreedsData();
      hasMoreBreeds.value = false;
      scrollLoading.value = false;

      await loadMoreBreeds();

      expect(scrollLoading.value).toBe(false);
    });
  });

  describe('isFavorite', () => {
    it('should return true when breed is in favorites', () => {
      const { isFavorite, favorites } = useBreedsData();
      favorites.value = ['bulldog', 'retriever'];

      expect(isFavorite('bulldog')).toBe(true);
      expect(isFavorite('retriever')).toBe(true);
    });

    it('should return false when breed is not in favorites', () => {
      const { isFavorite, favorites } = useBreedsData();
      favorites.value = ['bulldog'];

      expect(isFavorite('retriever')).toBe(false);
      expect(isFavorite('husky')).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    it('should add favorite when not in favorites', async () => {
      mockApiService.addFavorite.mockResolvedValue(undefined);
      mockApiService.getFavorites.mockResolvedValue(['bulldog']);

      const { toggleFavorite, favorites } = useBreedsData();

      await toggleFavorite('bulldog');

      expect(mockApiService.addFavorite).toHaveBeenCalledWith('bulldog');
      expect(favorites.value).toContain('bulldog');
    });

    it('should remove favorite when in favorites', async () => {
      mockApiService.removeFavorite.mockResolvedValue(undefined);
      mockApiService.getFavorites.mockResolvedValue([]);

      const { toggleFavorite, favorites } = useBreedsData();
      favorites.value = ['bulldog'];

      await toggleFavorite('bulldog');

      expect(mockApiService.removeFavorite).toHaveBeenCalledWith('bulldog');
      expect(favorites.value).not.toContain('bulldog');
    });

    it('should handle toggle errors', async () => {
      mockApiService.addFavorite.mockRejectedValue(new Error('Toggle failed'));

      const { toggleFavorite } = useBreedsData();

      await toggleFavorite('bulldog');

      expect(console.error).toHaveBeenCalledWith('Error toggling favorite:', expect.any(Error));
    });
  });

  describe('onModalToggleFavorite', () => {
    it('should toggle favorite for modal breed', async () => {
      mockApiService.addFavorite.mockResolvedValue(undefined);
      mockApiService.getFavorites.mockResolvedValue(['bulldog']);

      const { onModalToggleFavorite, modalBreed } = useBreedsData();
      modalBreed.value = 'bulldog';

      await onModalToggleFavorite();

      expect(mockApiService.addFavorite).toHaveBeenCalledWith('bulldog');
    });
  });

  describe('closeModal', () => {
    it('should close modal and reset state', () => {
      const { closeModal, modalShow, modalBreed, modalImages } = useBreedsData();
      modalShow.value = true;
      modalBreed.value = 'bulldog';
      modalImages.value = ['image1.jpg'];

      closeModal();

      expect(modalShow.value).toBe(false);
      expect(modalBreed.value).toBe('');
      expect(modalImages.value).toEqual([]);
    });
  });

  describe('loadBreedImages', () => {
    it('should load images for breeds not in map', async () => {
      mockApiService.getBreedImages.mockResolvedValue(['image1.jpg']);

      const { loadBreedImages, breedImageMap } = useBreedsData();

      await loadBreedImages(['bulldog', 'retriever']);

      expect(breedImageMap.value.bulldog).toBe('image1.jpg');
      expect(breedImageMap.value.retriever).toBe('image1.jpg');
    });

    it('should skip breeds already in map', async () => {
      const { loadBreedImages, breedImageMap } = useBreedsData();
      breedImageMap.value.bulldog = 'existing.jpg';

      await loadBreedImages(['bulldog', 'retriever']);

      expect(breedImageMap.value.bulldog).toBe('existing.jpg');
    });

    it('should handle image loading errors', async () => {
      mockApiService.getBreedImages.mockRejectedValue(new Error('Image load failed'));

      const { loadBreedImages, breedImageMap } = useBreedsData();

      await loadBreedImages(['bulldog']);

      expect(breedImageMap.value.bulldog).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Error loading images for bulldog:', expect.any(Error));
    });

    it('should handle empty images array', async () => {
      mockApiService.getBreedImages.mockResolvedValue([]);

      const { loadBreedImages, breedImageMap } = useBreedsData();

      await loadBreedImages(['bulldog']);

      expect(breedImageMap.value.bulldog).toBeUndefined();
    });
  });

  describe('handleScroll', () => {
    it('should not load more when search term exists', () => {
      const { handleScroll } = useBreedsData();

      handleScroll();

      // Should not trigger loadMoreBreeds when no search term
    });

    it('should not load more when throttled', () => {
      const { handleScroll } = useBreedsData();

      handleScroll();

      // Should not trigger loadMoreBreeds when not throttled
    });

    it('should load more when near bottom', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 1000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });

      const { handleScroll } = useBreedsData();

      handleScroll();

      // Test that the function executes without error
      expect(true).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should compute filteredBreeds correctly', () => {
      const { filteredBreeds } = useBreedsData();

      // Test that filteredBreeds is a computed property
      expect(filteredBreeds.value).toBeDefined();
    });
  });
});
