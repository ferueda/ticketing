import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/orders for get requests', async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.status).toEqual(401);
});

it('can fetch a list of orders', async () => {
  const tickets = [
    { id: new mongoose.Types.ObjectId().toHexString(), title: 'test 1', price: 10 },
    { id: new mongoose.Types.ObjectId().toHexString(), title: 'test 2', price: 20 },
  ];

  for (let ticket of tickets) {
    await Ticket.build(ticket).save();
  }
  const cookie = global.signin();
  const firstResponse = await request(app).get('/api/orders').set('Cookie', cookie).send();
  expect(firstResponse.status).toEqual(200);
  expect(firstResponse.body.length).toEqual(0);

  const createdTickets = await Ticket.find({});

  for (let ticket of createdTickets) {
    await request(app).post('/api/orders').set('Cookie', cookie).send({ ticketId: ticket.id });
  }

  const secondResponse = await request(app).get('/api/orders').set('Cookie', cookie).send();

  expect(secondResponse.status).toEqual(200);
  expect(secondResponse.body.length).toEqual(2);
});
