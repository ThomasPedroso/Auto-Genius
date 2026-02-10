import { Router } from 'express';
import { generateSignedUploadUrl } from '../services/storageService';

const router = Router();

router.post('/signed-url', async (req, res) => {
  const { filePath, contentType } = req.body;

  if (!filePath || !contentType) {
    res.status(400).json({ error: 'filePath e contentType são obrigatórios' });
    return;
  }

  try {
    const result = await generateSignedUploadUrl(filePath, contentType);
    res.json(result);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Erro ao gerar URL de upload' });
  }
});

export default router;
