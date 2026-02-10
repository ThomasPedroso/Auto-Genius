import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getPosts, createPost, updatePost } from '../services/firestoreService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

router.post('/', async (req, res) => {
  const { uid } = req as AuthenticatedRequest;
  try {
    await createPost(uid, req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

router.patch('/:postId', async (req, res) => {
  try {
    await updatePost(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

export default router;
