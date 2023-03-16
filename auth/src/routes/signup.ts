import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError, DatabaseConnError, BadRequestError } from '../errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').trim().isLength({ min: 4 }).withMessage('invalid password'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('email is already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    return res.status(201).send({ user });
  },
);

export { router as signupRouter };
