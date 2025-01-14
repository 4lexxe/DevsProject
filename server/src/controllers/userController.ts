import express, { Request, Response } from 'express';
import User from '../models/User';
import UserService from '../services/UserService';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, roleId } = req.body;
  try {
    const user = await User.create({ name, email, password, phone, roleId });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Ha ocurrido un problema' });
    }
  }
};

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserService.deleteUser(Number(id));
    if (user) {
      res.status(200).json({ message: `Usuario con id ${id} eliminado correctamente` });
    } else {
      res.status(404).json({ message: `Usuario con id ${id} no encontrado` });
    }
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

// Actualizar un usuario por ID
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, phone, roleId } = req.body;

  try {
    const user = await UserService.updateUser(Number(id), name, email, password, phone, roleId);
    if (user) {
      res.status(200).json({ message: "Usuario actualizado correctamente", user });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
  }
};