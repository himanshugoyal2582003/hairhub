import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (payload: { id: string; email: string; role: string; name: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400).json({ error: 'Name, email, and password are required' }); return; }
    if (password.length < 6) { res.status(400).json({ error: 'Password must be at least 6 characters' }); return; }
    if (await User.findOne(email.toLowerCase())) { res.status(409).json({ error: 'Email already registered' }); return; }
    const user = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12) });
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({ message: 'Account created successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image } });
  } catch (err) { console.error('Register error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: 'Email and password are required' }); return; }
    const user = await User.findOne(email.toLowerCase());
    if (!user?.password || !(await bcrypt.compare(password, user.password))) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image } });
  } catch (err) { console.error('Login error:', err); res.status(500).json({ error: 'Internal server error' }); }
};


export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: 'Email and password are required' }); return; }
    const user = await User.findOne(email.toLowerCase());
    if (!user?.password || !(await bcrypt.compare(password, user.password))) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    if (user.role !== 'admin') { res.status(403).json({ error: 'Access denied. Account is not an administrator.' }); return; }
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image } });
  } catch (err) { console.error('Admin login error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, adminSecret } = req.body;
    const secretInput = adminSecret || req.body.adminCode;
    if (!name || !email || !password || !secretInput) {
      res.status(400).json({ error: 'Name, email, password, and admin secret are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const envAdminSecret = process.env.ADMIN_SECRET || process.env.ADMIN_SECRET_CODE;
    if (envAdminSecret && secretInput !== envAdminSecret) {
      res.status(403).json({ error: 'Invalid admin secret code' });
      return;
    }
    if (await User.findOne(email.toLowerCase())) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.createAdmin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      adminCode: secretInput,
    });
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
    });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) { res.status(401).json({ error: 'Not authorized' }); return; }
    const user = await User.findById(req.user?.id);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    const { password: _password, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const updateProfile = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) { res.status(401).json({ error: 'Not authorized' }); return; }
    const { name, image } = req.body;
    if (name !== undefined && (!name || name.trim().length < 2)) {
      res.status(400).json({ error: 'Name must be at least 2 characters' });
      return;
    }
    const updated = await User.updateProfile(req.user.id, { name: name?.trim(), image });
    if (!updated) { res.status(404).json({ error: 'User not found' }); return; }
    const { password: _password, ...safeUser } = updated;
    res.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePassword = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) { res.status(401).json({ error: 'Not authorized' }); return; }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user?.password || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(req.user.id, hashedPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
