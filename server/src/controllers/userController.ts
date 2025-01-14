import express, { Request, Response } from 'express';
import User from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, roleId } = req.body;
  try {
    const user = await User.create({ name, email, password, phone, roleId });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Ah ocurrido un problema' });
    }
  }
};