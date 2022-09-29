import jwt from 'jsonwebtoken';

import { getJwtSecret } from './env';
import { JwtObject } from './types';

export function signJwt(obj: JwtObject): string {
  return jwt.sign(obj, getJwtSecret(), {
    expiresIn: '15d',
  });
}

// Throws one of VerifyErrors on bad tokens
export function verifyJwt(token: string): JwtObject {
  return jwt.verify(token, getJwtSecret()) as JwtObject;
}
