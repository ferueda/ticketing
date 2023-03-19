import express from 'express';
import { currentUser } from '@frticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  if (!req.session?.jwt) return res.send({ user: null });
  res.send({ user: req.user || null });
});

export { router as currentUserRouter };
