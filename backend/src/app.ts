import express, { Application, Request, Response } from "express";
import config from './config/config';
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { breedsRoutes } from './routes/breedsRoutes';
import { favoritesRoutes } from './routes/favoritesRoutes';
import { Logger } from "./utils/logger";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandling();
    }

    private config(): void {
        //security middleware
        this.app.use(helmet());

        //CORS setup
        Logger.info('CORS Origins configured:', config.corsOrigin);
        this.app.use(cors({
            origin: config.corsOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }))

        //request logging
        this.app.use(morgan('combined'));

        //body parsing middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        //helath check endpoint
        this.app.get('/api/health', (req: Request, res: Response) => {
            res.status(200).json({
                status: 'OK', 
                timeStamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        });

        this.app.get('/api', (req: Request, res: Response) => {
            res.status(200).json({
                message: "API root endpoint. Use /api/breeds or /api/favorites",
            });
        });

        //API Routes
        this.app.use('/api/breeds', breedsRoutes);
        this.app.use('/api/favorites', favoritesRoutes);

        //404 handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({
                error: 'Route not found',
                path: req.originalUrl,
            });
        });
    }

    private errorHandling(): void {
        this.app.use(errorHandler);
    }
}

export default new App().app;
