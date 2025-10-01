import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import type { FavoriteBreed } from '../models/favoriteBreed';
import { dogApiService } from '../services/dogApiService';

// In-memory storage for favorites (can be replaced with a database later)
let favoriteBreeds: FavoriteBreed[] = [];

// Cache valid breeds list in controller or service level for performance
let validBreedsCache: string[] = [];

async function loadValidBreeds() {
  if (validBreedsCache.length === 0) {
    validBreedsCache = await dogApiService.getAllBreeds();
  }
  return validBreedsCache;
}

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

      const validBreeds = await loadValidBreeds();
      if (!validBreeds.includes(breed)) {
        res.status(400).json({ error: 'Invalid breed name' });
        return;
      }

      // Check if breed is already in favorites (by breed name)
      const exists = favoriteBreeds.find(fav => fav.breed === breed);
      if (exists) {
        res.status(409).json({ error: 'Breed is already in favorites' });
        return;
      }

      const newFavorite: FavoriteBreed = {
        breed,
        addedAt: new Date().toISOString(),
      };

      favoriteBreeds.push(newFavorite);
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

      const index = favoriteBreeds.findIndex(fav => fav.breed === breed);
      
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
