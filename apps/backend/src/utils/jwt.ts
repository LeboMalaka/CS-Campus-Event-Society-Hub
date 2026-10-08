import jwt, { SignOptions } from 'jsonwebtoken';

export type UserRole = 'student' | 'society_admin';

export type TokenPayload = {
  id: string;
  email: string;
  role: UserRole;
};

export function signToken(user: { id: string; email: string; role: UserRole }) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d',
  };

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    options
  );
}

export function verifyToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.verify(token, secret) as TokenPayload;
}
