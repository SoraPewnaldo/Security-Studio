import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
    },
  });
});

export default router;
