import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

export interface AuthenticatedRequest extends Request {
  uid: string;
  userEmail?: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token ausente' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as AuthenticatedRequest).uid = decoded.uid;
    (req as AuthenticatedRequest).userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
