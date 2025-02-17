import { Router } from 'express';
import { registerUserSchema, loginUserSchema } from 'validator';
import { generateAccessToken } from './utils/jwt.js';
import { prisma } from './db.js';

const authRouter = Router();

authRouter.post('/signin', async (req, res) => {
  if (req.userId) {
    return res.status(400).json({ message: 'Already logged in' });
  }
  const validation = loginUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.flatten());
  }
  const { email, password } = validation.data;
  const user = await prisma.user.findUnique({ where: { email, password }, select: { id: true, email: true } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = generateAccessToken({ id: user.id, email: user.email });
  res.json({ token });
});

authRouter.post('/signup', async (req, res) => {
  if (req.userId) {
    return res.status(400).json({ message: 'Already logged in' });
  }
  const validation = registerUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.flatten());
  }
  const { repeatPassword, ...data } = validation.data;
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }
  const user = await prisma.user.create({ data, select: { id: true, email: true } });
  const token = generateAccessToken({ id: user.id, email: user.email });
  res.json({ token });
});

authRouter.get('/profile', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await prisma.user.findUnique({ where: { id: req.userId }, omit: { password: true } });
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(user);
});

export default authRouter;
