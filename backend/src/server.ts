import app from "./app";
import config from "./config/config";
import { Logger } from "./utils/logger";

const startServer = (): void => {
  const port = config.port || 3001;
  const server = app.listen(port, '0.0.0.0', () => {
    Logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${port}`);
    Logger.info(`📍 API available at: http://0.0.0.0:${port}`);
    Logger.info(`🏥 Health check: http://0.0.0.0:${port}/health`);
  });

  process.on('SIGTERM', () => {
    Logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      Logger.info('Process terminated');
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err: Error) => {
    Logger.error('Uncaught exception', err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    Logger.error('Unhandled Rejection: ', reason);
    process.exit(1);
  });
};

startServer();
