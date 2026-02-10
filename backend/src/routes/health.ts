import { Router } from 'express';
import { checkDatabaseConnection } from '../services/firestoreService';

const router = Router();

router.get('/', async (_req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    dbConnection: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
