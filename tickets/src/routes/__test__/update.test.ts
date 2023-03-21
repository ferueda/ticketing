import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'whatever',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .set({
      title: '',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .set({
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .set({
      title: 'test',
      price: -20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .set({
      title: 'test',
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 20 });

  const newTitle = 'updated';
  const newPrice = 1000;

  const r = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});
