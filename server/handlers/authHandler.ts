import crypto from 'crypto';

import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '../api';
import { signJwt } from '../auth';
import { db } from '../datastore';
import { saveUserInfo } from '../localStorage';
import { ExpressHandler, User } from '../types';

export const signInHandler: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.sendStatus(400);
  }

  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== hashPassword(password)) {
    return res.sendStatus(403);
  }

  const jwt = signJwt({ userId: existing.id });

  saveUserInfo(existing)

  return res.status(200).send({
    user: {
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      id: existing.id,
      username: existing.username,
    },
    jwt: jwt,
  });
};

export const signUpHandler: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  if (!email || !firstName || !lastName || !username || !password) {
    return res.status(400).send({error:'All fields are required'});
  }

  const existing = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));
  if (existing) {
    return res.status(403).send({error:'User already exists'});
  }

  
  const user: User = {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    username,
    password:hashPassword(password),
  };
  const jwt = signJwt({userId: user.id});
  //Save to Browser Local Storage
  saveUserInfo(user);

  await db.createUser(user);
  return res.status(200).send({
   jwt
  })
};

function hashPassword(password:string): string{
  return crypto.pbkdf2Sync(password, process.env.PASSWORD_SALT!,10,32,'sha512').toString('hex');
}