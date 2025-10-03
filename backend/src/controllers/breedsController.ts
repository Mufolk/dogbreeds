import { Request, Response } from 'express';
import { dogApiService } from '../services/dogApiService';
import { Logger } from '../utils/logger';

export class BreedsController {
  /**
   * Get all dog breeds with pagination
   * GET /api/breeds?page=1&limit=30
   */
  async getAllBreeds(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 30;
      
      const breeds = await dogApiService.getAllBreeds();
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBreeds = breeds.slice(startIndex, endIndex);
      
      const totalBreeds = breeds.length;
      const totalPages = Math.ceil(totalBreeds / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      res.json({
        breeds: paginatedBreeds,
        pagination: {
          currentPage: page,
          totalPages,
          totalBreeds,
          limit,
          hasNextPage,
          hasPrevPage
        }
      });
    } catch (error) {
      Logger.error('Error in getAllBreeds:', error);
      res.status(500).json({ 
        error: 'Failed to fetch dog breeds',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get images for a specific breed
   * GET /api/breeds/:breed/images
   */
  async getBreedImages(req: Request, res: Response): Promise<void> {
    try {
      const { breed } = req.params;
      const count = parseInt(req.query.count as string) || 3;

      if (!breed) {
        res.status(400).json({ error: 'Breed parameter is required' });
        return;
      }

      const images = await dogApiService.getBreedImages(breed, count);
      res.json(images);
    } catch (error) {
      Logger.error('Error in getBreedImages:', error);
      res.status(500).json({ 
        error: 'Failed to fetch breed images',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const breedsController = new BreedsController();