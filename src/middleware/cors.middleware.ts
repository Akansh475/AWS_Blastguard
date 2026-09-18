import cors from 'cors';
import { config } from '../config';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      config.frontendUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in development for local testing
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
});
