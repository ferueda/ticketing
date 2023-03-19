import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'test';
  const price = 20;

  const newTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });

  expect(newTicketResponse.status).toEqual(201);

  const ticketResponse = await request(app).get(`/api/tickets/${newTicketResponse.body.id}`).send();

  expect(ticketResponse.status).toEqual(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
