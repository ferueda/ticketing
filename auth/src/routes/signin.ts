import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middleware/validate-request';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').trim().notEmpty().withMessage('invalid password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError('incorrect email or password');

    const isMatch = await Password.compare(user.password, password);
    if (!isMatch) throw new BadRequestError('incorrect email or password');

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = { jwt: userJwt };
    return res.status(200).send({ user });
  },
);

export { router as signinRouter };
