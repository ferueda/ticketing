import { CustomError } from './custom-error';

export class DatabaseConnError extends CustomError {
  statusCode = 500;
  reason = 'error connecting to database';

  constructor() {
    super('error connecting to database');
    Object.setPrototypeOf(this, DatabaseConnError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
