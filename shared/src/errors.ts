export enum ERRORS {
  TOKEN_EXPIRED = 'Token expired',
  BAD_TOKEN = 'Bad token',

  USER_NOT_FOUND = 'User not found',
  USER_REQUIRED_FIELDS = 'Email, username, and password are required',
  DUPLICATE_EMAIL = 'An account with this email already exists',
  DUPLICATE_USERNAME = 'An account with this username already exists',
  INVALID_EMAIL = 'Invalid email',
  WEAK_PASSWORD = 'Weak password',
  INVALID_USERNAME = 'Username must have only letters and numbers',
  INVALID_FIRSTNAME = 'First name must have only letters and numbers',
  INVALID_LASTNAME = 'Last name must have only letters and numbers',

  POST_ID_MISSING = 'Post ID is missing',
  POST_NOT_FOUND = 'Post not found',
  DUPLICATE_URL = 'A post with this URL already exists',

  COMMENT_MISSING = 'Comment is missing',
  COMMENT_ID_MISSING = 'Comment ID is missing',

  DUPLICATE_LIKE = 'Duplicate like',
}
