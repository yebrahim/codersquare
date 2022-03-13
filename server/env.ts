// Throws on bad tokens
export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Missing JWT secret');
      process.exit(1);
    }
    return secret!;
  }


  export function getSalt(): string {
    const salt = process.env.PASSWORD_SALT;
    if (!salt) {
      console.error('Missing Password salt');
      process.exit(1);
    }
    return salt!;
  }