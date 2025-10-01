import { FavoritesController } from '../favoritesController';
import type { Request, Response } from 'express';
import { dogApiService } from '../../services/dogApiService';

jest.mock('../../services/dogApiService');

describe('FavoritesController Extended', () => {
  let controller: FavoritesController;
  let mockBreeds: string[];

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(() => {
    controller = new FavoritesController();
    mockBreeds = ['bulldog', 'retriever', 'husky'];
    (dogApiService.getAllBreeds as jest.Mock).mockResolvedValue(mockBreeds);
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test('addFavorite adds a breed successfully', async () => {
    const req = { body: { breed: 'bulldog' } } as unknown as Request;
    const res = mockResponse();

    await controller.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Breed added to favorites', breed: 'bulldog' });
  });

  test('addFavorite rejects invalid breed', async () => {
    const req = { body: { breed: 'invalidbreed' } } as unknown as Request;
    const res = mockResponse();

    await controller.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid breed name' });
  });

  test('addFavorite rejects duplicate breed', async () => {
    const reqOnFirstAdd = { body: { breed: 'bulldog' } } as unknown as Request;
    const res1 = mockResponse();

    await controller.addFavorite(reqOnFirstAdd, res1);

    const reqOnSecondAdd = { body: { breed: 'bulldog' } } as unknown as Request;
    const res2 = mockResponse();

    await controller.addFavorite(reqOnSecondAdd, res2);

    expect(res2.status).toHaveBeenCalledWith(409);
    expect(res2.json).toHaveBeenCalledWith({ error: 'Breed is already in favorites' });
  });

  test('removeFavorite removes a breed successfully', async () => {
    const reqAdd = { body: { breed: 'husky' } } as unknown as Request;
    const resAdd = mockResponse();
    await controller.addFavorite(reqAdd, resAdd);

    const reqRemove = { params: { breed: 'husky' } } as unknown as Request;
    const resRemove = mockResponse();
    await controller.removeFavorite(reqRemove, resRemove);

    expect(resRemove.json).toHaveBeenCalledWith({ message: 'Breed removed from favorites', breed: 'husky' });
  });

  test('removeFavorite returns 404 if breed not found', async () => {
    const req = { params: { breed: 'notfound' } } as unknown as Request;
    const res = mockResponse();

    await controller.removeFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Breed not found in favorites' });
  });

  test('addFavorite validation failure on missing breed', async () => {
    const req = { body: {} } as Request;
    const res = mockResponse();
    await controller.addFavorite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('removeFavorite missing breed param', async () => {
    const req = { params: {} } as unknown as Request;
    const res = mockResponse();
    await controller.removeFavorite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});
