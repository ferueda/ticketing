import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError, DatabaseConnError } from '../errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').trim().isLength({ min: 4 }).withMessage('invalid password'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, passoword } = req.body;

    console.log('Creating a user...');
    throw new DatabaseConnError();
    res.send({});
  },
);

export { router as signupRouter };
