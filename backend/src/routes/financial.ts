import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { calculateFinancialService, checkVehicleStatus } from '../services/financialService';
import { getUserProfile } from '../services/firestoreService';

const router = Router();

router.post('/simulate', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  const { serviceType } = req.body;

  if (!serviceType) {
    res.status(400).json({ error: 'serviceType é obrigatório' });
    return;
  }

  try {
    const user = await getUserProfile(uid);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    const result = await calculateFinancialService(serviceType, user);
    res.json(result);
  } catch (error) {
    console.error('Error simulating financial service:', error);
    res.status(500).json({ error: 'Erro na simulação' });
  }
});

router.post('/vehicle-status', async (req, res) => {
  const { type, car } = req.body;

  if (!type || !car) {
    res.status(400).json({ error: 'type e car são obrigatórios' });
    return;
  }

  try {
    const result = await checkVehicleStatus(type, car);
    res.json(result);
  } catch (error) {
    console.error('Error checking vehicle status:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

export default router;
