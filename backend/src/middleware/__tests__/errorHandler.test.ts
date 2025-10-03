import { Request, Response, NextFunction } from 'express';
import { errorHandler, createError, AppError } from '../errorHandler';
import config from '../../config/config';
import { Logger } from '../../utils/logger';

jest.mock('../../config/config');
jest.mock('../../utils/logger');

const mockConfig = config as jest.Mocked<typeof config>;

describe('ErrorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      url: '/api/test',
      method: 'GET',
      originalUrl: '/api/test'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle error with default status code', () => {
      mockConfig.nodeEnv = 'development';
      const error = new Error('Test error') as AppError;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(Logger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Test error',
        stack: error.stack,
        url: '/api/test',
        method: 'GET'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Test error',
          stack: expect.any(String)
        },
        timeStamp: expect.any(String),
        path: '/api/test'
      });
    });

    it('should handle error with custom status code', () => {
      mockConfig.nodeEnv = 'development';
      const error = new Error('Not found') as AppError;
      error.statusCode = 404;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(Logger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Not found',
        stack: error.stack,
        url: '/api/test',
        method: 'GET'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not found',
          stack: expect.any(String)
        },
        timeStamp: expect.any(String),
        path: '/api/test'
      });
    });

    it('should hide error details in production for 500 errors', () => {
      mockConfig.nodeEnv = 'production';
      const error = new Error('Internal server error') as AppError;
      error.statusCode = 500;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal server error'
        },
        timeStamp: expect.any(String),
        path: '/api/test'
      });
    });

    it('should show error details in development for 500 errors', () => {
      mockConfig.nodeEnv = 'development';
      const error = new Error('Internal server error') as AppError;
      error.statusCode = 500;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal server error',
          stack: error.stack
        },
        timeStamp: expect.any(String),
        path: '/api/test'
      });
    });

    it('should not hide error details in production for non-500 errors', () => {
      mockConfig.nodeEnv = 'production';
      const error = new Error('Not found') as AppError;
      error.statusCode = 404;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not found'
        },
        timeStamp: expect.any(String),
        path: '/api/test'
      });
    });

    it('should handle error without stack trace', () => {
      const error = new Error('Test error');
      delete error.stack;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(Logger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Test error',
        stack: undefined,
        url: '/api/test',
        method: 'GET'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle error without message', () => {
      const error = new Error();
      error.message = undefined as any;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(Logger.error).toHaveBeenCalledWith('Unhandled error', {
        error: undefined,
        stack: error.stack,
        url: '/api/test',
        method: 'GET'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle request without originalUrl', () => {
      mockConfig.nodeEnv = 'development';
      mockRequest.originalUrl = undefined;
      const error = new Error('Test error') as AppError;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Test error',
          stack: expect.any(String)
        },
        timeStamp: expect.any(String),
        path: undefined
      });
    });
  });

  describe('createError', () => {
    it('should create error with default status code', () => {
      const error = createError('Test error');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with custom status code', () => {
      const error = createError('Not found', 404);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with 0 status code', () => {
      const error = createError('Test error', 0);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(0);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with empty message', () => {
      const error = createError('');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });
  });
});
