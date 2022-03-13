import jwt from 'jsonwebtoken';
import { JwtObject } from './types';
import {getJwtSecret} from './env';

export function signJwt(obj: JwtObject): string {
  return jwt.sign(obj, getJwtSecret(), {
    expiresIn: '7d',
  });
}

export function verifyJwt(token: string): JwtObject {
  return jwt.verify(token, getJwtSecret()) as JwtObject;
}
