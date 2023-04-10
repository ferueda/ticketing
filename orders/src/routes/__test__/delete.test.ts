import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders/:id for delete requests', async () => {
  const response = await request(app).delete('/api/orders/:id').send({});
  expect(response.status).not.toEqual(404);
});

it('returns a 401 if user not logged in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${id}`).send().expect(401);
});

it('returns a 404 if the order is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${id}`).set('Cookie', global.signin()).send().expect(404);
});

it('returns an error if one user tries to delete another users order', async () => {
  const user1 = global.signin();
  const user2 = global.signin();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    price: 20,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user2).send().expect(401);
  const dbOrder = await Order.findById(order.id);
  expect(dbOrder).not.toBeNull();
  expect(dbOrder!.status).not.toBe(OrderStatus.Cancelled);
});

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);
  const dbOrder = await Order.findById(order.id);
  expect(dbOrder).not.toBeNull();
  expect(dbOrder!.status).toBe(OrderStatus.Cancelled);
});

it('publishes an event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
