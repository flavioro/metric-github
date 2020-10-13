import request from 'supertest';
import MockAdapter from 'axios-mock-adapter';
import Mongoose from 'mongoose';

import app from '../../../src/app';
import factory from '../../utils/factory';
import User from '../../../src/models/User';
import token from '../../utils/jwtoken';
import accessApiGithub from '../../../src/config/AccessApiGithub';

interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
}

interface User {
  email: string;
  password: string;
}

describe('ProjectsController', () => {
  const apiMock = new MockAdapter(accessApiGithub);

  let user_id: string;
  beforeEach(async () => {
    await User.deleteMany({});

    const userData = await factory.attrs<User>('User');
    const user = await User.create(userData);

    user_id = user._id;
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of repositories suggestions', async () => {
    const repositories = await factory.attrsMany<GithubRepository>(
      'GithubRepository',
      3,
    );
    const authorization = `Bearer ${token(user_id)}`;

    apiMock.onGet('/search/repositories').reply(200, { items: repositories });

    const response = await request(app)
      .get('/v1.0/repositories/react')
      .set('Authorization', authorization)
      .send();

    repositories.forEach(({ id, name, full_name }) => {
      expect(response.body).toContainEqual({ id, name, full_name });
    });
  });

  it('should not be able to get a list of repositories suggestions', async () => {
    const authorization = `Bearer ${token(user_id)}`;

    apiMock.onGet('/search/repositories').reply(400);

    const response = await request(app)
      .get('/v1.0/repositories/react')
      .set('Authorization', authorization)
      .send();

    expect(response.body).toStrictEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    });
  });
});
