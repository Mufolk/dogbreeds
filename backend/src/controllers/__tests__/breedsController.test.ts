import { BreedsController } from '../breedsController';
import type { Request, Response } from 'express';
import { dogApiService } from '../../services/dogApiService';
import { Logger } from '../../utils/logger';

jest.mock('../../services/dogApiService');
jest.mock('../../utils/logger');

describe('BreedsController', () => {
  let controller: BreedsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new BreedsController();
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllBreeds', () => {
    const mockBreeds = ['bulldog', 'retriever', 'husky', 'beagle', 'poodle'];

    beforeEach(() => {
      (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);
    });

    it('should return paginated breeds with default parameters', async () => {
      mockRequest.query = {};
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(dogApiService.getAllBreeds).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: mockBreeds.slice(0, 30), // default limit
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBreeds: 5,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should handle custom pagination parameters', async () => {
      mockRequest.query = { page: '2', limit: '2' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: ['husky', 'beagle'], // page 2, limit 2
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
      mockRequest.query = { search: 'bul' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
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

    it('should handle case-insensitive search', async () => {
      mockRequest.query = { search: 'HUSKY' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: ['husky'],
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

    it('should handle empty search results', async () => {
      mockRequest.query = { search: 'nonexistent' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalBreeds: 0,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should handle invalid page parameter', async () => {
      mockRequest.query = { page: 'invalid' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: mockBreeds.slice(0, 30),
        pagination: {
          currentPage: 1, // defaults to 1
          totalPages: 1,
          totalBreeds: 5,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should handle invalid limit parameter', async () => {
      mockRequest.query = { limit: 'invalid' };
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        breeds: mockBreeds.slice(0, 30), // defaults to 30
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBreeds: 5,
          limit: 30,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('API Error');
      (dogApiService.getAllBreeds as jest.Mock).mockRejectedValue(error);
      mockRequest.query = {};
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(Logger.error).toHaveBeenCalledWith('Error in getAllBreeds:', error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch dog breeds',
        message: 'API Error'
      });
    });

    it('should handle unknown errors', async () => {
      (dogApiService.getAllBreeds as jest.Mock).mockRejectedValue('Unknown error');
      mockRequest.query = {};
      
      await controller.getAllBreeds(mockRequest as Request, mockResponse as Response);

      expect(Logger.error).toHaveBeenCalledWith('Error in getAllBreeds:', 'Unknown error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch dog breeds',
        message: 'Unknown error'
      });
    });
  });

  describe('getBreedImages', () => {
    const mockImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

    beforeEach(() => {
      (dogApiService.getBreedImages as jest.Mock).mockResolvedValue(mockImages);
    });

    it('should return breed images with default count', async () => {
      mockRequest.params = { breed: 'bulldog' };
      mockRequest.query = {};
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 3);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImages);
    });

    it('should return breed images with custom count', async () => {
      mockRequest.params = { breed: 'bulldog' };
      mockRequest.query = { count: '5' };
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 5);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImages);
    });

    it('should handle missing breed parameter', async () => {
      mockRequest.params = {};
      mockRequest.query = {};
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Breed parameter is required'
      });
      expect(dogApiService.getBreedImages).not.toHaveBeenCalled();
    });

    it('should handle empty breed parameter', async () => {
      mockRequest.params = { breed: '' };
      mockRequest.query = {};
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Breed parameter is required'
      });
      expect(dogApiService.getBreedImages).not.toHaveBeenCalled();
    });

    it('should handle invalid count parameter', async () => {
      mockRequest.params = { breed: 'bulldog' };
      mockRequest.query = { count: 'invalid' };
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(dogApiService.getBreedImages).toHaveBeenCalledWith('bulldog', 3); // defaults to 3
      expect(mockResponse.json).toHaveBeenCalledWith(mockImages);
    });

    it('should handle service errors', async () => {
      const error = new Error('Image fetch failed');
      (dogApiService.getBreedImages as jest.Mock).mockRejectedValue(error);
      
      mockRequest.params = { breed: 'bulldog' };
      mockRequest.query = {};
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(Logger.error).toHaveBeenCalledWith('Error in getBreedImages:', error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch breed images',
        message: 'Image fetch failed'
      });
    });

    it('should handle unknown errors', async () => {
      (dogApiService.getBreedImages as jest.Mock).mockRejectedValue('Unknown error');
      
      mockRequest.params = { breed: 'bulldog' };
      mockRequest.query = {};
      
      await controller.getBreedImages(mockRequest as Request, mockResponse as Response);

      expect(Logger.error).toHaveBeenCalledWith('Error in getBreedImages:', 'Unknown error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch breed images',
        message: 'Unknown error'
      });
    });
  });
});
