import type { Transaction } from "sequelize"
import User from "../../modules/user/User"
import Role from "../../modules/role/Role"
import Admin from "../../modules/admin/Admin"
import Permission from "../../modules/Permission/Permission"
import RolePermission from "../../modules/role/RolePermission"
import bcrypt from "bcrypt"
import { AuthProvider } from "../../modules/user/User"

export async function createSuperUser(
  email: string,
  password: string,
  name: string,
  username: string,
  transaction?: Transaction,
): Promise<User> {
  const t = transaction || (await User.sequelize!.transaction())

  try {
    // 1. Obtener o crear el rol de superadmin
    const [superAdminRole] = await Role.findOrCreate({
      where: { name: "superadmin" },
      defaults: {
        name: "superadmin",
        description: "Super administrador con acceso completo",
      },
      transaction: t,
    })

    // 2. Obtener todos los permisos
    const allPermissions = await Permission.findAll({ transaction: t })

    // 3. Asignar todos los permisos al rol de superadmin
    const rolePermissions = allPermissions.map((permission) => ({
      roleId: superAdminRole.id,
      permissionId: permission.id,
    }))

    await RolePermission.bulkCreate(rolePermissions, {
      updateOnDuplicate: ["roleId", "permissionId"],
      transaction: t,
    })

    // 4. Crear el usuario
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const superUser = await User.create(
      {
        email,
        password: hashedPassword,
        name,
        username,
        roleId: superAdminRole.id,
        authProvider: AuthProvider.LOCAL,
      },
      { transaction: t },
    )

    // 5. Crear la entrada en la tabla Admin
    await Admin.create(
      {
        name,
        admin_since: new Date(),
        permissions: allPermissions.map((p) => p.name),
        isSuperAdmin: true,
        userId: superUser.id,
      },
      { transaction: t },
    )

    if (!transaction) {
      await t.commit()
    }

    return superUser
  } catch (error) {
    if (!transaction) {
      await t.rollback()
    }
    throw error
  }
}