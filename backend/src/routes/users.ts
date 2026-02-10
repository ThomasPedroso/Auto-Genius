import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserProfile, getPublicUserProfile, updateUserProfile } from '../services/firestoreService';

const router = Router();

router.get('/me', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  try {
    const firebaseUser = await admin.auth().getUser(uid);
    const profile = await getUserProfile(uid, firebaseUser.displayName || undefined, firebaseUser.email || undefined, firebaseUser.photoURL || undefined);
    if (!profile) {
      res.status(404).json({ error: 'Perfil não encontrado' });
      return;
    }
    res.json(profile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

router.get('/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const profile = await getPublicUserProfile(uid);
    if (!profile) {
      res.status(404).json({ error: 'Perfil não encontrado ou privado' });
      return;
    }
    res.json(profile);
  } catch (error) {
    console.error('Error getting public user profile:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

router.patch('/me', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  try {
    await updateUserProfile(uid, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

export default router;
