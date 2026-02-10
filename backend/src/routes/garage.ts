import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserGarage, addCarToGarage, updateGarageCar, deleteGarageCar } from '../services/firestoreService';

const router = Router();

// GET /users/me/garage
router.get('/me/garage', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  try {
    const garage = await getUserGarage(uid);
    res.json(garage);
  } catch (error) {
    console.error('Error fetching garage:', error);
    res.status(500).json({ error: 'Erro ao buscar garagem' });
  }
});

// GET /users/:uid/garage (public)
router.get('/:uid/garage', async (req, res) => {
  const { uid } = req.params;
  try {
    const garage = await getUserGarage(uid);
    res.json(garage);
  } catch (error) {
    console.error('Error fetching public garage:', error);
    res.status(500).json({ error: 'Erro ao buscar garagem' });
  }
});

// POST /users/me/garage
router.post('/me/garage', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  try {
    const car = await addCarToGarage(uid, req.body);
    if (!car) {
      res.status(500).json({ error: 'Erro ao adicionar carro' });
      return;
    }
    res.status(201).json(car);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ error: 'Erro ao adicionar carro' });
  }
});

// PATCH /users/me/garage/:carId
router.patch('/me/garage/:carId', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  const { carId } = req.params;
  try {
    await updateGarageCar(uid, carId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Erro ao atualizar carro' });
  }
});

// DELETE /users/me/garage/:carId
router.delete('/me/garage/:carId', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  const { carId } = req.params;
  try {
    await deleteGarageCar(uid, carId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Erro ao deletar carro' });
  }
});

export default router;
