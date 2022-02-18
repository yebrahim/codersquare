CREATE TABLE users (
  id        VARCHAR PRIMARY KEY,
  firstName VARCHAR NOT NULL,
  lastName  VARCHAR NOT NULL,
  userName  VARCHAR UNIQUE NOT NULL,
  email     VARCHAR UNIQUE NOT NULL,
  password  VARCHAR NOT NULL
);

CREATE TABLE posts (
  id       VARCHAR PRIMARY KEY,
  title    VARCHAR NOT NULL,
  url      VARCHAR UNIQUE NOT NULL,
  userId   VARCHAR NOT NULL,
  postedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE Table comments (
  id      VARCHAR PRIMARY KEY,
  userId  VARCHAR NOT NULL,
  PostId  VARCHAR NOT NULL,
  Comment VARCHAR NOT NULL,
  PostedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (PostId) REFERENCES posts (id)
)

CREATE Table likes (
  UserId  VARCHAR NOT NULL,
  PostId  VARCHAR NOT NULL,
  FOREIGN KEY (UserId) REFERENCES users (id),
  FOREIGN KEY (PostId) REFERENCES posts (id)
)

