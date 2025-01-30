import User from '../user/User';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware'; // Importar el middleware de permisos

class UserService {
  static async createUser(name: string, email: string, password: string, phone: string, roleId: number, requiredPermissions: string[]) {
    try {
      // Verificar permisos antes de proceder
      await permissionsMiddleware(requiredPermissions);

      const user = await User.create({ name, email, password, phone, roleId });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error al crear el usuario: " + error.message);
      } else {
        throw new Error("Error al crear el usuario: " + String(error));
      }
    }
  }

  static async getUsers(requiredPermissions: string[]) {
    try {
      // Verificar permisos antes de proceder
      await permissionsMiddleware(requiredPermissions);

      const users = await User.findAll();
      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error al obtener los usuarios: " + error.message);
      } else {
        throw new Error("Error al obtener los usuarios: " + String(error));
      }
    }
  }

  static async deleteUser(id: number, requiredPermissions: string[]) {
    try {
      // Verificar permisos antes de proceder
      await permissionsMiddleware(requiredPermissions);

      const user = await User.findByPk(id);
      if (!user) {
        return null; // Si no existe el usuario
      }
      await user.destroy(); // Eliminar el usuario
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error al eliminar el usuario: " + error.message);
      } else {
        throw new Error("Error al eliminar el usuario: " + String(error));
      }
    }
  }

  static async updateUser(id: number, name: string, email: string, password: string, phone: string, roleId: number, requiredPermissions: string[]) {
    try {
      // Verificar permisos antes de proceder
      await permissionsMiddleware(requiredPermissions);

      const user = await User.findByPk(id);
      if (!user) {
        return null; // Si no existe el usuario
      }
      
      await user.update({ 
        name, 
        email, 
        password, 
        phone, 
        roleId 
      });
      
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error al actualizar el usuario: " + error.message);
      } else {
        throw new Error("Error al actualizar el usuario: " + String(error));
      }
    }
  }
}

export default UserService;