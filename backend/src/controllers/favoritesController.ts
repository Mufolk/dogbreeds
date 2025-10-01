import { Request, Response } from 'express';
import { Logger } from '../utils/logger';

// In-memory storage for favorites (can be replaced with a database later)
let favoriteBreeds: string[] = [];

export class FavoritesController {
  /**
   * Get all favorite breeds
   * GET /api/favorites
   */
  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      res.json(favoriteBreeds);
    } catch (error) {
      Logger.error('Error in getFavorites:', error);
      res.status(500).json({ 
        error: 'Failed to fetch favorite breeds',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Add a breed to favorites
   * POST /api/favorites
   */
  async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { breed } = req.body;

      if (!breed || typeof breed !== 'string') {
        res.status(400).json({ error: 'Breed is required and must be a string' });
        return;
      }

      // Check if breed is already in favorites
      if (favoriteBreeds.includes(breed)) {
        res.status(409).json({ error: 'Breed is already in favorites' });
        return;
      }

      favoriteBreeds.push(breed);
      res.status(201).json({ message: 'Breed added to favorites', breed });
    } catch (error) {
      Logger.error('Error in addFavorite:', error);
      res.status(500).json({ 
        error: 'Failed to add breed to favorites',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Remove a breed from favorites
   * DELETE /api/favorites/:breed
   */
  async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { breed } = req.params;

      if (!breed) {
        res.status(400).json({ error: 'Breed parameter is required' });
        return;
      }

      const index = favoriteBreeds.indexOf(breed);
      if (index === -1) {
        res.status(404).json({ error: 'Breed not found in favorites' });
        return;
      }

      favoriteBreeds.splice(index, 1);
      res.json({ message: 'Breed removed from favorites', breed });
    } catch (error) {
      Logger.error('Error in removeFavorite:', error);
      res.status(500).json({ 
        error: 'Failed to remove breed from favorites',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const favoritesController = new FavoritesController();