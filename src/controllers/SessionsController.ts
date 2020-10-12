import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { Request, Response } from 'express';

import { login } from '../services/UserService';
import authenticate from '../config/authenticate';

class SessionsController {
  async store(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    const { _id } = await login(email, password);

    response.json({
      user: { _id },
      token: jwt.sign({ id: _id, session: v4() }, authenticate.secret, {
        expiresIn: authenticate.expirationTime,
      }),
    });
  }
}

export default SessionsController;
