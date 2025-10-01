import { Request, Response } from 'express';
import { dogApiService } from '../services/dogApiService';
import { Logger } from '../utils/logger';

export class BreedsController {
  /**
   * Get all dog breeds
   * GET /api/breeds
   */
  async getAllBreeds(req: Request, res: Response): Promise<void> {
    try {
      const breeds = await dogApiService.getAllBreeds();
      res.json(breeds);
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