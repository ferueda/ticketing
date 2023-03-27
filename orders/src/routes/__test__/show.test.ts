import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/orders/:id for get requests', async () => {
  const response = await request(app).get('/api/orders/:id').send({});
  expect(response.status).not.toEqual(404);
});

it('returns a 401 if user not logged in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/orders/${id}`).send().expect(401);
});

it('returns a 404 if the order is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/orders/${id}`).set('Cookie', global.signin()).send().expect(404);
});

it('returns an error if one user tries to fetch another users order', async () => {
  const user1 = global.signin();
  const user2 = global.signin();
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user2).send().expect(401);
});

it('returns the order if found', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
