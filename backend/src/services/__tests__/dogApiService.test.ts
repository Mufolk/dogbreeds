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

        jest.useRealTimers();
    });
});
