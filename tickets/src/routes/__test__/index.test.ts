import request from 'supertest';
import { app } from '../../app';

it('can fetch a list of tickets', async () => {
  const tickets = [
    { title: 'test 1', price: 10 },
    { title: 'test 2', price: 20 },
    { title: 'test 3', price: 30 },
  ];

  const firstResponse = await request(app).get('/api/tickets').send();
  expect(firstResponse.status).toEqual(200);
  expect(firstResponse.body.length).toEqual(0);

  for (let ticket of tickets) {
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticket);
  }

  const secondResponse = await request(app).get('/api/tickets').send();
  expect(secondResponse.status).toEqual(200);
  expect(secondResponse.body.length).toEqual(3);
});
