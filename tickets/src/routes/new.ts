import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@frticketing/common';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('title is invalid'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.user!.id });
    await ticket.save();
    res.status(201).send(ticket);
  },
);

export { router as createTicketRouter };
