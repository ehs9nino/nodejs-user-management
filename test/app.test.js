const request = require('supertest');
const { app } = require('../app');
const chai = require('chai');
const { expect } = chai;

describe('Node.js User Management API', () => {
  it('should add a user successfully', async () => {
    const user = { email: 'test@example.com', age: 25 };

    const res = await request(app)
      .post('/add_user')
      .send(user);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('User added successfully!');
  });

  it('should return a user', async () => {
    const res = await request(app)
      .get('/get_user?email=test@example.com');

    expect(res.status).to.equal(200);
    expect(res.body.email).to.equal('test@example.com');
  });
});
