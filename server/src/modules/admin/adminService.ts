import Admin from "./Admin";
import User from "../user/User";

interface AdminData {
  name: string;
  admin_since: Date;
  permissions: string[];
  isSuperAdmin: boolean;
  admin_notes?: string;
}

export const createAdmin = async (userId: number, adminData: AdminData): Promise<Admin> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const roleId = adminData.isSuperAdmin ? 3 : 2;
    await user.update({ roleId });

    const admin = await Admin.create({
      ...adminData,
      userId: userId,
      name: adminData.name,
    });

    return admin;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al crear el administrador: ${error instanceof Error ? error.message : 'error desconocido'}`);
  }
};

export const getAllAdmins = async (): Promise<Admin[]> => {
  try {
    const admins = await Admin.findAll({
      include: [
        {
          model: User,
          as: 'adminUser', // Usa el alias correcto
        },
      ],
    });

    return admins;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al obtener los administradores: ${error instanceof Error ? error.message : "error desconocido"}`);
  }
};

export const getAdminById = async (adminId: number): Promise<Admin | null> => {
  try {
    const admin = await Admin.findByPk(adminId, {
      include: [
        {
          model: User,
          as: 'adminUser', // Usa el alias correcto
        },
      ],
    });

    return admin;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al obtener el administrador: ${error instanceof Error ? error.message : "error desconocido"}`);
  }
};

export const updateAdmin = async (adminId: number, adminData: Partial<AdminData>): Promise<Admin | null> => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return null;
    }

    await admin.update(adminData);

    return admin;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al actualizar el administrador: ${error instanceof Error ? error.message : "error desconocido"}`);
  }
};

export const deleteAdmin = async (adminId: number): Promise<boolean> => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return false;
    }

    await admin.destroy();
    return true;
  } catch (error) {
    console.error("Error detallado:", error);
    throw new Error(`Error al eliminar el administrador: ${error instanceof Error ? error.message : "error desconocido"}`);
  }
};