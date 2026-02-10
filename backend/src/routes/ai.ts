import { Router } from 'express';
import {
  generateFinancialExplanation,
  getVehicleHealthAnalysis,
  generateCarImage,
  searchCarsWithGemini,
} from '../services/geminiService';

const router = Router();

router.post('/financial-explanation', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Prompt é obrigatório' });
    return;
  }
  try {
    const text = await generateFinancialExplanation(prompt);
    res.json({ text });
  } catch (error) {
    console.error('Error generating financial explanation:', error);
    res.status(500).json({ error: 'Erro ao gerar explicação' });
  }
});

router.post('/vehicle-health', async (req, res) => {
  const { issueDescription } = req.body;
  if (!issueDescription) {
    res.status(400).json({ error: 'Descrição do problema é obrigatória' });
    return;
  }
  try {
    const text = await getVehicleHealthAnalysis(issueDescription);
    res.json({ text });
  } catch (error) {
    console.error('Error analyzing vehicle health:', error);
    res.status(500).json({ error: 'Erro ao analisar veículo' });
  }
});

router.post('/car-image', async (req, res) => {
  const { make, model, year, color, description } = req.body;
  if (!make || !model) {
    res.status(400).json({ error: 'Make e model são obrigatórios' });
    return;
  }
  try {
    const imageUrl = await generateCarImage(make, model, year || 2024, color || '', description || '');
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating car image:', error);
    res.status(500).json({ error: 'Erro ao gerar imagem' });
  }
});

router.post('/search-cars', async (req, res) => {
  const { query, cars } = req.body;
  if (!query || !cars) {
    res.status(400).json({ error: 'Query e cars são obrigatórios' });
    return;
  }
  try {
    const matchedIds = await searchCarsWithGemini(query, cars);
    res.json({ matchedIds });
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});

export default router;
