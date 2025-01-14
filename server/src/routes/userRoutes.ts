import express from 'express';
import UserService from '../services/UserService';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/userController'; // Importar los controladores



const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, phone, roleId } = req.body;
    const user = await UserService.createUser(name, email, password, phone, roleId);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

// Ruta para eliminar un usuario

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.deleteUser(Number(id));
    if (user) {
      res.status(200).json({ message: `Usuario con id ${id} eliminado correctamente` });
    } else {
      res.status(404).json({ message: `Usuario con id ${id} no encontrado` });
    }
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

// Ruta para crear un usuario
router.post('/users', createUser);

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para actualizar un usuario
router.put('/users/:id', updateUser);

// Ruta para eliminar un usuario
router.delete('/users/:id', deleteUser);

export default router;