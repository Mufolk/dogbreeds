import { Request, Response } from 'express';
import { dogApiService } from '../services/dogApiService';
import { Logger } from '../utils/logger';

export class BreedsController {
  /**
   * Get all dog breeds with pagination and optional search
   * GET /api/breeds?page=1&limit=30&search=golden
   */
  async getAllBreeds(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 30;
      const search = req.query.search as string;
      
      const breeds = await dogApiService.getAllBreeds();
      
      // Filter breeds if search term is provided
      let filteredBreeds = breeds;
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredBreeds = breeds.filter(breed => 
          breed.toLowerCase().includes(searchTerm)
        );
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBreeds = filteredBreeds.slice(startIndex, endIndex);
      
      const totalBreeds = filteredBreeds.length;
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