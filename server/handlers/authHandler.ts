import crypto from 'crypto';

import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '../api';
import { signJwt } from '../auth';
import { Datastore, db } from '../datastore';
import { ExpressHandler, User } from '../types';

export class AuthHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public signInHandler: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
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
        username: existing.username,
      },
      jwt,
    });
  };

  public signUpHandler: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    if (!email || !firstName || !lastName || !username || !password) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const existing =
      (await this.db.getUserByEmail(email)) || (await this.db.getUserByUsername(username));
    if (existing) {
      return res.status(403).send({ error: 'User already exists' });
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      username,
      password: this.hashPassword(password),
    };

    await this.db.createUser(user);
    const jwt = signJwt({ userId: user.id });
    return res.status(200).send({
      jwt,
    });
  };

  private hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.PASSWORD_SALT!, 42, 64, 'sha512')
      .toString('hex');
  }
}
