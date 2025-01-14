import Admin from "../models/Admin";
import User from "../models/User";

interface AdminData {
  admin_since: Date;
  permissions: string[];
  isSuperAdmin: boolean;
  admin_notes?: string;
}

export const createAdmin = async (userId: number, adminData: AdminData) => {
  try {
    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Crear el administrador
    const admin = await Admin.create({
      ...adminData,
      userId: userId,
    });

    return admin;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al crear el administrador: ${error instanceof Error ? error.message : 'error desconocido'}`);
  }
};

export const getAllAdmins = async () => {
  try {
    const admins = await Admin.findAll({
      include: [
        {
          model: User,
          as: 'user', // Asegúrate de usar el alias definido en la asociación
        },
      ],
    });

    return admins;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(
      `Error al obtener los administradores: ${
        error instanceof Error ? error.message : "error desconocido"
      }`
    );
  }
};