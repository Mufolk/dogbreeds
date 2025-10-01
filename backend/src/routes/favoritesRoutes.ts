import { Router } from 'express';
import { favoritesController } from '../controllers/favoritesController';

const router = Router();

// GET /api/favorites - Get all favorite breeds
router.get('/', favoritesController.getFavorites);

// POST /api/favorites - Add a breed to favorites
router.post('/', favoritesController.addFavorite);

// DELETE /api/favorites/:breed - Remove a breed from favorites
router.delete('/:breed', favoritesController.removeFavorite);

export { router as favoritesRoutes };