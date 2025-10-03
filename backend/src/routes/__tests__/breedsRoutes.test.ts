import request from 'supertest';
import express from 'express';
import { breedsRoutes } from '../breedsRoutes';
import { dogApiService } from '../../services/dogApiService';
import { Logger } from '../../utils/logger';

jest.mock('../../services/dogApiService');
jest.mock('../../utils/logger');

const app = express();
app.use(express.json());
app.use('/api/breeds', breedsRoutes);

describe('Breeds Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/breeds', () => {
    it('should return breeds with default pagination', async () => {
      const mockBreeds = ['bulldog', 'retriever', 'husky'];
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/breeds')
        .expect(200);

      expect(response.body).toEqual({
        breeds: mockBreeds,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBreeds: 3,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should return breeds with custom pagination', async () => {
      const mockBreeds = ['bulldog', 'retriever', 'husky', 'beagle', 'poodle'];
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/breeds?page=2&limit=2')
        .expect(200);

      expect(response.body).toEqual({
        breeds: ['husky', 'beagle'],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalBreeds: 5,
          limit: 2,
          hasNextPage: true,
          hasPrevPage: true
        }
      });
    });

    it('should filter breeds by search term', async () => {
      const mockBreeds = ['bulldog', 'retriever', 'husky', 'beagle'];
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/breeds?search=bul')
        .expect(200);

      expect(response.body).toEqual({
        breeds: ['bulldog'],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBreeds: 1,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should handle service errors', async () => {
      (dogApiService.getAllBreeds as jest.Mock).mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/api/breeds')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to fetch dog breeds',
        message: 'API Error'
      });
    });

    it('should handle invalid page parameter', async () => {
      const mockBreeds = ['bulldog', 'retriever'];
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/breeds?page=invalid')
        .expect(200);

      expect(response.body.pagination.currentPage).toBe(1);
    });

    it('should handle invalid limit parameter', async () => {
      const mockBreeds = ['bulldog', 'retriever'];
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);

      const response = await request(app)
        .get('/api/breeds?limit=invalid')
        .expect(200);

      expect(response.body.pagination.limit).toBe(30);
    });
  });

  describe('GET /api/breeds/:breed/images', () => {
    it('should return breed images with default count', async () => {
      const mockImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      (dogApiService.getBreedImages as jest.Mock).mockResolvedValue(mockImages);

      const response = await request(app)
        .get('/api/breeds/bulldog/images')
        .expect(200);

      expect(response.body).toEqual(mockImages);
      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 3);
    });

    it('should return breed images with custom count', async () => {
      const mockImages = ['image1.jpg', 'image2.jpg'];
      (dogApiService.getBreedImages as jest.Mock).mockResolvedValue(mockImages);

      const response = await request(app)
        .get('/api/breeds/bulldog/images?count=2')
        .expect(200);

      expect(response.body).toEqual(mockImages);
      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 2);
    });

    it('should handle missing breed parameter', async () => {
      const response = await request(app)
        .get('/api/breeds//images')
        .expect(404);

      // Express treats empty path parameter as 404, not 400
      expect(response.status).toBe(404);
    });

    it('should handle service errors', async () => {
      (dogApiService.getBreedImages as jest.Mock).mockRejectedValue(new Error('Image fetch failed'));

      const response = await request(app)
        .get('/api/breeds/bulldog/images')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to fetch breed images',
        message: 'Image fetch failed'
      });
    });

    it('should handle invalid count parameter', async () => {
      const mockImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      (dogApiService.getBreedImages as jest.Mock).mockResolvedValue(mockImages);

      const response = await request(app)
        .get('/api/breeds/bulldog/images?count=invalid')
        .expect(200);

      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 3);
    });
  });
});
