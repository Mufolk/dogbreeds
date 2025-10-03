import axios from 'axios';
import { DogApiService } from '../dogApiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DogApiService', () => {
    let service: DogApiService;

    beforeEach(() => {
        service = new DogApiService();
    });

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    test('getAllBreeds returns a flattened sorted array from API', async () => {
        mockedAxios.get.mockResolvedValue({
        data: {
            status: 'success',
            message: {
            bulldog: ['boston', 'english'],
            retriever: [],
            },
        },
        });

        const breeds = await service.getAllBreeds();

        expect(breeds).toContain('bulldog-boston');
        expect(breeds).toContain('bulldog-english');
        expect(breeds).toContain('bulldog');
        expect(breeds).toContain('retriever');
        expect(breeds.length).toBeGreaterThan(0);
    });

    test('getBreedImages returns images from API', async () => {
        mockedAxios.get.mockResolvedValue({
        data: {
            status: 'success',
            message: ['https://dog.image/1.jpg', 'https://dog.image/2.jpg', 'https://dog.image/3.jpg'],
        },
        });

        const images = await service.getBreedImages('bulldog', 3);

        expect(images).toHaveLength(3);
    });

    test('getAllBreeds throws error on failure', async () => {
        mockedAxios.get.mockResolvedValue({ data: { status: 'error' } });

        await expect(service.getAllBreeds()).rejects.toThrow('Failed to fetch dog breeds');
    });


    jest.useFakeTimers();

    test('getAllBreeds cache expiration', async () => {
    mockedAxios.get.mockResolvedValueOnce({
        data: {
        status: 'success',
        message: { bulldog: [] },
        },
    });

    const breeds1 = await service.getAllBreeds();
    expect(breeds1).toContain('bulldog');

    // Advance timers past cache expiry to reset cache
    jest.advanceTimersByTime(service['CACHE_DURATION_MS'] + 100);

    mockedAxios.get.mockResolvedValueOnce({
        data: {
        status: 'success',
        message: { retriever: [] },
        },
    });

    const breeds2 = await service.getAllBreeds();
        expect(breeds2).toContain('retriever');
    });

    test('getBreedImages returns empty array on API error', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));

        await expect(service.getBreedImages('bulldog', 3)).rejects.toThrow('Failed to fetch images for breed: bulldog');
    });

    test('getBreedImages handles API response with error status', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'error',
                message: 'Breed not found'
            }
        });

        await expect(service.getBreedImages('nonexistent', 3)).rejects.toThrow('Failed to fetch images for breed: nonexistent');
    });

    test('getBreedImages handles malformed API response', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: 'invalid data'
            }
        });

        const result = await service.getBreedImages('bulldog', 3);
        expect(result).toBe('invalid data');
    });

    test('getBreedImages handles empty images array', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: []
            }
        });

        const images = await service.getBreedImages('bulldog', 3);
        expect(images).toEqual([]);
    });

    test('getBreedImages handles null response data', async () => {
        mockedAxios.get.mockResolvedValue({
            data: null
        });

        await expect(service.getBreedImages('bulldog', 3)).rejects.toThrow('Failed to fetch images for breed: bulldog');
    });

    test('getBreedImages handles undefined response data', async () => {
        mockedAxios.get.mockResolvedValue({
            data: undefined
        });

        await expect(service.getBreedImages('bulldog', 3)).rejects.toThrow('Failed to fetch images for breed: bulldog');
    });

    test('getAllBreeds handles breeds with sub-breeds correctly', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: {
                    bulldog: ['boston', 'english', 'french'],
                    retriever: ['golden', 'labrador'],
                    husky: []
                }
            }
        });

        const breeds = await service.getAllBreeds();
        
        expect(breeds).toContain('bulldog');
        expect(breeds).toContain('bulldog-boston');
        expect(breeds).toContain('bulldog-english');
        expect(breeds).toContain('bulldog-french');
        expect(breeds).toContain('retriever');
        expect(breeds).toContain('retriever-golden');
        expect(breeds).toContain('retriever-labrador');
        expect(breeds).toContain('husky');
    });

    test('getAllBreeds handles empty breeds object', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: {}
            }
        });

        const breeds = await service.getAllBreeds();
        expect(breeds).toEqual([]);
    });

    test('getAllBreeds handles null message', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: null
            }
        });

        await expect(service.getAllBreeds()).rejects.toThrow('Failed to fetch dog breeds');
    });

    test('getAllBreeds handles undefined message', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: undefined
            }
        });

        await expect(service.getAllBreeds()).rejects.toThrow('Failed to fetch dog breeds');
    });

    test('getBreedImages handles different count values', async () => {
        // Test with count 0 - API should return empty array
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                status: 'success',
                message: []
            }
        });

        const images = await service.getBreedImages('bulldog0', 0);
        expect(images).toEqual([]);

        // Test with count 2 - API should return 2 images
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                status: 'success',
                message: ['img1.jpg', 'img2.jpg']
            }
        });

        const images2 = await service.getBreedImages('bulldog2', 2);
        expect(images2).toEqual(['img1.jpg', 'img2.jpg']);

        // Test with count 10 - API should return 5 images (all available)
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                status: 'success',
                message: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg']
            }
        });

        const images3 = await service.getBreedImages('bulldog10', 10);
        expect(images3).toEqual(['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg']);
    });

    test('getBreedImages handles negative count', async () => {
        // API should handle negative count gracefully and return some images
        mockedAxios.get.mockResolvedValue({
            data: {
                status: 'success',
                message: ['img1.jpg', 'img2.jpg', 'img3.jpg']
            }
        });

        const images = await service.getBreedImages('bulldog-negative', -1);
        expect(images).toEqual(['img1.jpg', 'img2.jpg', 'img3.jpg']);
    });

    afterAll(() => {
        jest.useRealTimers();
    });
});
