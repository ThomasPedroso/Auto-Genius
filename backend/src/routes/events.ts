import { Router } from 'express';
import { getEvents, rsvpEvent } from '../services/firestoreService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

router.post('/:eventId/rsvp', async (req, res) => {
  const { eventId } = req.params;
  const { increment } = req.body;
  try {
    await rsvpEvent(eventId, increment);
    res.json({ success: true });
  } catch (error) {
    console.error('Error RSVPing:', error);
    res.status(500).json({ error: 'Erro ao confirmar presença' });
  }
});

export default router;
