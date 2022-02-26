CREATE Table comments (
  id      VARCHAR PRIMARY KEY,
  userId  VARCHAR NOT NULL,
  postId  VARCHAR NOT NULL,
  comment VARCHAR NOT NULL,
  postedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (PostId) REFERENCES posts (id)
)

CREATE Table likes (
  userId  VARCHAR NOT NULL,
  postId  VARCHAR NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (postId) REFERENCES posts (id)
)
