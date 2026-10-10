import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbStore } from '../storage/dbStore';
import { UserModel } from '../models/User';
import { isConnected } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'travelmate_super_secret_jwt_key_2026';

export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    // Role safety: public registration is strictly 'user'. Admin can only be created via migration or admin console.
    const userRole: 'user' | 'admin' = role === 'admin' ? 'user' : 'user';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isConnected()) {
      const existing = await UserModel.findOne({ email: email.toLowerCase() });
      if (existing) {
        res.status(409).json({ success: false, message: 'Account with this email already exists.' });
        return;
      }

      const created = await UserModel.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: userRole,
      });

      const token = jwt.sign(
        { id: created._id.toString(), email: created.email, role: created.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
          role: created.role,
        },
      });
      return;
    }

    // Local fallback store
    const existingInStore = dbStore.findUserByEmail(email);
    if (existingInStore) {
      res.status(409).json({ success: false, message: 'Account with this email already exists.' });
      return;
    }

    const newUser = dbStore.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: userRole,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: (error as Error).message });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    let foundUser: { id: string; name: string; email: string; passwordHash: string; role: 'user' | 'admin' } | null = null;

    if (isConnected()) {
      const u = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (u) {
        foundUser = {
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
        };
      }
    }

    if (!foundUser) {
      const u = dbStore.findUserByEmail(email);
      if (u) {
        foundUser = {
          id: u._id,
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
        };
      }
    }

    if (!foundUser) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
      return;
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: (error as Error).message });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized.' });
    return;
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
}
