import request from 'supertest';
import { app } from '../../app';

it('returns a 400 with an email that does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'PassworD!',
    })
    .expect(400);
});

it('returns a 400 with an incorrect password', async () => {
  const email = 'test@test.com';

  await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password: 'PassworD!',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'incorrectPassword',
    })
    .expect(400);
});

it('returns a 200 with valid credentials', async () => {
  const email = 'test@test.com';
  const password = 'PassworD!';

  await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(200);
});

it('sets a cookie after successful signin', async () => {
  const email = 'test@test.com';
  const password = 'PassworD!';

  await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
