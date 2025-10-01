import { Router } from 'express';
import { breedsController } from '../controllers/breedsController';

const router = Router();

// GET /api/breeds - Get all dog breeds
router.get('/', breedsController.getAllBreeds);

// GET /api/breeds/:breed/images - Get images for a specific breed
router.get('/:breed/images', breedsController.getBreedImages);

export { router as breedsRoutes };