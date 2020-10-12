import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../src/app';

describe('Authenticate middleware', () => {
  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should not be able to be authorized without token', async () => {
    const response = await request(app).get('/v1.0/auth');

    expect(response.body).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Missing authorization token',
    });
  });

  it('should not be able to be authorized with invalid token', async () => {
    const authorization = 'jfafjsugjasfsajsfjjs';
    const response = await request(app)
      .get('/v1.0/auth')
      .set('Authorization', authorization);

    expect(response.body).toStrictEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token invalid or expired',
    });
  });
});
