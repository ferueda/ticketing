import { OrderStatus } from '@frticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').set('Cookie', global.signin()).send({});
  expect(response.status).not.toEqual(401);
});

it('return an error if an invalid ticketId is provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: 'wrong',
    })
    .expect(400);
  await request(app).post('/api/orders').set('Cookie', global.signin()).send({}).expect(400);
});

it('return an error if ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('return an error if ticket is not available', async () => {
  const ticket = Ticket.build({ title: 'test ticket', price: 10 });
  await ticket.save();
  const order = Order.build({
    userId: '123',
    status: OrderStatus.Complete,
    ticket,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('creates an order with valid inputs', async () => {
  const ticket = Ticket.build({ title: 'test', price: 10 });
  await ticket.save();

  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId: ticket.id,
  });

  orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Created);
  expect(orders[0].ticket.toJSON()).toEqual(ticket.id);
});

it('publishes an event', async () => {
  const ticket = Ticket.build({ title: 'test', price: 10 });
  await ticket.save();

  await request(app).post('/api/orders').set('Cookie', global.signin()).send({
    ticketId: ticket.id,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
