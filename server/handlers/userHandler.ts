import {
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  User,
} from '@codersquare/shared';
import crypto from 'crypto';

import { signJwt } from '../auth';
import { Datastore } from '../datastore';
import { ExpressHandler, ExpressHandlerWithParams } from '../types';

export class UserHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public signIn: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.sendStatus(400);
    }

    const existing =
      (await this.db.getUserByEmail(login)) || (await this.db.getUserByUsername(login));
    if (!existing || existing.password !== this.hashPassword(password)) {
      return res.sendStatus(403);
    }

    const jwt = signJwt({ userId: existing.id });

    return res.status(200).send({
      user: {
        email: existing.email,
        firstName: existing.firstName,
        lastName: existing.lastName,
        id: existing.id,
        userName: existing.userName,
      },
      jwt,
    });
  };

  public signUp: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
    const { email, firstName, lastName, password, userName } = req.body;
    if (!email || !userName || !password) {
      return res.status(400).send({ error: 'Email, username, and password are required' });
    }

    if (await this.db.getUserByEmail(email)) {
      return res.status(403).send({ error: 'A user with this email already exists' });
    }
    if (await this.db.getUserByUsername(userName)) {
      return res.status(403).send({ error: 'A user with this username already exists' });
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      userName: userName,
      password: this.hashPassword(password),
    };

    await this.db.createUser(user);
    const jwt = signJwt({ userId: user.id });
    return res.status(200).send({
      jwt,
    });
  };

  public get: ExpressHandlerWithParams<{ id: string }, GetUserRequest, GetUserResponse> = async (
    req,
    res
  ) => {
    const { id } = req.params;
    if (!id) return res.sendStatus(400);

    const user = await this.db.getUserById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    });
  };

  public getCurrent: ExpressHandler<GetCurrentUserRequest, GetCurrentUserResponse> = async (
    _,
    res
  ) => {
    const user = await this.db.getUserById(res.locals.userId);
    if (!user) {
      return res.sendStatus(500);
    }
    return res.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    });
  };

  private hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.PASSWORD_SALT!, 42, 64, 'sha512')
      .toString('hex');
  }
}
