import request from 'supertest';
import express from 'express';

// Mock the controller methods directly
const mockGetFavorites = jest.fn();
const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();

jest.mock('../../controllers/favoritesController', () => ({
  FavoritesController: jest.fn().mockImplementation(() => ({
    getFavorites: mockGetFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  })),
  favoritesController: {
    getFavorites: mockGetFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  },
}));

import { favoritesRoutes } from '../favoritesRoutes';

const app = express();
app.use(express.json());
app.use('/api/favorites', favoritesRoutes);

describe('Favorites Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/favorites', () => {
    it('should call getFavorites controller method', async () => {
      const mockFavorites = [{ breed: 'bulldog', addedAt: '2023-01-01' }];
      mockGetFavorites.mockImplementation(async (req, res) => {
        res.json(mockFavorites);
      });

      await request(app)
        .get('/api/favorites')
        .expect(200);

      expect(mockGetFavorites).toHaveBeenCalled();
    });

    it('should handle controller errors', async () => {
      mockGetFavorites.mockImplementation(async (req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      await request(app)
        .get('/api/favorites')
        .expect(500);

      expect(mockGetFavorites).toHaveBeenCalled();
    });
  });

  describe('POST /api/favorites', () => {
    it('should call addFavorite controller method with request body', async () => {
      const breedData = { breed: 'bulldog' };
      mockAddFavorite.mockImplementation(async (req, res) => {
        res.status(201).json({ message: 'Breed added to favorites', breed: 'bulldog' });
      });

      await request(app)
        .post('/api/favorites')
        .send(breedData)
        .expect(201);

      expect(mockAddFavorite).toHaveBeenCalled();
    });

    it('should handle controller validation errors', async () => {
      mockAddFavorite.mockImplementation(async (req, res) => {
        res.status(400).json({ error: 'Invalid breed name' });
      });

      await request(app)
        .post('/api/favorites')
        .send({ breed: 'invalid' })
        .expect(400);

      expect(mockAddFavorite).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/favorites/:breed', () => {
    it('should call removeFavorite controller method with breed parameter', async () => {
      mockRemoveFavorite.mockImplementation(async (req, res) => {
        res.json({ message: 'Breed removed from favorites', breed: 'bulldog' });
      });

      await request(app)
        .delete('/api/favorites/bulldog')
        .expect(200);

      expect(mockRemoveFavorite).toHaveBeenCalled();
    });

    it('should handle breed not found errors', async () => {
      mockRemoveFavorite.mockImplementation(async (req, res) => {
        res.status(404).json({ error: 'Breed not found in favorites' });
      });

      await request(app)
        .delete('/api/favorites/nonexistent')
        .expect(404);

      expect(mockRemoveFavorite).toHaveBeenCalled();
    });

    it('should handle missing breed parameter', async () => {
      const response = await request(app)
        .delete('/api/favorites/')
        .expect(404);

      // Express treats empty path parameter as 404, not 400
      expect(response.status).toBe(404);
    });
  });
});