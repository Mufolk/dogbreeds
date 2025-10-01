import app from "./app"
import config from "./config/config";

const startServer = (): void => {
    const server = app.listen(config.port, () => {
        console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
        console.log(`📍 API available at: http://localhost:${config.port}`);
        console.log(`🏥 Health check: http://localhost:${config.port}/health`);
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('Process terminated');
            process.exit(0);
        });
    });

    //Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
        console.error('Uncaught exception', err);
        process.exit(1);
    });

    //Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
        console.error('Unhandled Rejection: ', reason);
        process.exit(1);
    });
}

startServer();