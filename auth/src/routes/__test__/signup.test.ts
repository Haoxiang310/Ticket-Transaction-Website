//fake request to express app using supertest
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup',async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email',async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdad',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password',async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asaad',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email and password',async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: '123123'
    })
    .expect(400);
});    

it('disallows duplicate emails',async()=>{
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

//this test is going to fail,
//because jest only send http request
//but we set cookie secure:true, which means
//cookie applies only when sending https request
it('sets a cookie after successful signup',async()=>{
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
})