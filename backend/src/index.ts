import * as admin from 'firebase-admin';

// Initialize Firebase Admin before importing routes
admin.initializeApp();

import express from 'express';
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import garageRouter from './routes/garage';
import marketplaceRouter from './routes/marketplace';
import postsRouter from './routes/posts';
import eventsRouter from './routes/events';
import aiRouter from './routes/ai';
import financialRouter from './routes/financial';
import storageRouter from './routes/storage';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// Public routes
app.use('/health', healthRouter);

// Protected routes (require Firebase Auth token)
app.use('/users', authMiddleware, usersRouter);
app.use('/users', authMiddleware, garageRouter);
app.use('/marketplace', authMiddleware, marketplaceRouter);
app.use('/posts', authMiddleware, postsRouter);
app.use('/events', authMiddleware, eventsRouter);
app.use('/ai', authMiddleware, aiRouter);
app.use('/financial', authMiddleware, financialRouter);
app.use('/storage', authMiddleware, storageRouter);

// Error handler
app.use(errorHandler);

// Export as Cloud Function 2nd gen
export const api = onRequest(
  {
    region: 'southamerica-east1',
    memory: '512MiB',
    timeoutSeconds: 120,
    secrets: ['GEMINI_API_KEY'],
  },
  app
);
