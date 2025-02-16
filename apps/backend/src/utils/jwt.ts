import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export function generateAccessToken(data: Pick<User, 'id' | 'email'>) {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: `${30 * 86400}s` });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as Pick<User, 'id' | 'email'>;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token = req.get('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const user = verifyAccessToken(token);
      req.userId = user.id;
    } catch (error) {}
  }
  next();
}
