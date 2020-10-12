import jwt from 'jsonwebtoken';

import authenticate from '../../src/config/authenticate';

export default (id: string): string => {
  return jwt.sign({ id }, authenticate.secret, {
    expiresIn: authenticate.expirationTime,
  });
};
