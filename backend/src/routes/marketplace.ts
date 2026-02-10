import { Router } from 'express';
import { getMarketplaceCars, updateMarketplaceCar } from '../services/firestoreService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const cars = await getMarketplaceCars();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Erro ao buscar marketplace' });
  }
});

router.patch('/:carId', async (req, res) => {
  const { carId } = req.params;
  try {
    await updateMarketplaceCar(carId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating marketplace car:', error);
    res.status(500).json({ error: 'Erro ao atualizar carro' });
  }
});

export default router;
