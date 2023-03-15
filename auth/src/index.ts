import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
