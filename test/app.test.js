const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { app } = require('../app');
const chai = require('chai');
const { expect } = chai;

const DATA_FILE = path.join(__dirname, '../users.json');

describe('Node.js User Management API', () => {
  beforeEach(() => {
    // Reset the users.json file before each test
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  });

  it('should add a user successfully', async () => {
    const user = { email: 'test@example.com', age: 25 };

    const res = await request(app)
      .post('/add_user')
      .send(user);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('User added successfully!');
    expect(res.body.user.email).to.equal(user.email);
    expect(res.body.user.age).to.equal(user.age);
  });

  it('should return a user', async () => {
    const user = { email: 'test@example.com', age: 25 };

    // Add the user first
    await request(app)
      .post('/add_user')
      .send(user);

    const res = await request(app)
      .get('/get_user?email=test@example.com');

    expect(res.status).to.equal(200);
    expect(res.body.email).to.equal('test@example.com');
    expect(res.body.age).to.equal(25);
  });

  it('should handle duplicate user gracefully', async () => {
    const user = { email: 'test@example.com', age: 25 };

    // Add the user first
    await request(app)
      .post('/add_user')
      .send(user);

    const res = await request(app)
      .post('/add_user')
      .send(user);

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal('User already exists!');
  });

  it('should delete a user successfully', async () => {
    const user = { email: 'test@example.com', age: 25 };

    // Add the user first
    await request(app)
      .post('/add_user')
      .send(user);

    const res = await request(app)
      .delete('/delete_user')
      .send({ email: 'test@example.com' });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User deleted successfully!');
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/get_user?email=nonexistent@example.com');

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('User not found!');
  });
});
