import sequelize from "../../infrastructure/database/db";
import User from "../../modules/user/User";
import Role from "../../modules/role/Role";
import Permission from "../../modules/Permission/Permission";
import RolePermission from "../../modules/role/RolePermission";
import bcrypt from "bcrypt";

// Definir roles iniciales con sus permisos
const rolesIniciales = [
  { name: "student", permissions: ["read_own_profile", "update_own_profile"] },
  { name: "instructor", permissions: ["read_own_profile", "update_own_profile", "create_course", "update_course"] },
  { name: "moderator", permissions: ["read_own_profile", "update_own_profile", "moderate_content"] },
  { name: "admin", permissions: ["read_own_profile", "update_own_profile", "manage_users", "manage_courses"] },
  { name: "superadmin", permissions: ["read_own_profile", "update_own_profile", "manage_users", "manage_courses", "manage_roles"] },
];

// Definir usuarios iniciales con sus roles
const usuariosIniciales = [
  {
    email: "student@example.com",
    password: "Student123!",
    name: "Estudiante Ejemplo",
    username: "student",
    roleName: "student",
  },
  {
    email: "instructor@example.com",
    password: "Instructor123!",
    name: "Instructor Ejemplo",
    username: "instructor",
    roleName: "instructor",
  },
  {
    email: "moderator@example.com",
    password: "Moderator123!",
    name: "Moderador Ejemplo",
    username: "moderator",
    roleName: "moderator",
  },
  {
    email: "admin@example.com",
    password: "Admin123!",
    name: "Administrador Ejemplo",
    username: "admin",
    roleName: "admin",
  },
  {
    email: "superadmin@example.com",
    password: "SuperAdmin123!",
    name: "Super Administrador",
    username: "superadmin",
    roleName: "superadmin",
  },
];

// Función para inicializar usuarios, roles y permisos
async function initializeUsersWithRolesAndPermissions() {
  const t = await sequelize.transaction();

  try {
    // 1. Crear todos los permisos si no existen
    const permissions = await Permission.bulkCreate(
      Permission.permisos.map((p) => ({ name: p.name, description: p.description })),
      { transaction: t, updateOnDuplicate: ["description"] }
    );

    // 2. Crear roles y asignar permisos
    const roles = await Role.bulkCreate(
      [
        { name: "student", description: "Estudiante del sistema" },
        { name: "instructor", description: "Instructor de cursos" },
        { name: "moderator", description: "Moderador de la comunidad" },
        { name: "admin", description: "Administrador del sistema" },
        { name: "superadmin", description: "Super administrador con acceso total" },
      ],
      { transaction: t, updateOnDuplicate: ["description"] }
    );

    // 3. Asignar permisos a los roles
    for (const role of roles) {
      const roleData = rolesIniciales.find((r) => r.name === role.name);
      if (roleData) {
        const permissionIds = permissions
          .filter((p) => roleData.permissions.includes(p.name))
          .map((p) => p.id);

        await RolePermission.bulkCreate(
          permissionIds.map((permissionId) => ({
            roleId: role.id,
            permissionId,
          })),
          { transaction: t, updateOnDuplicate: ["roleId", "permissionId"] }
        );
      }
    }

    // 4. Crear usuarios y asignar roles
    for (const userData of usuariosIniciales) {
      const role = roles.find((r) => r.name === userData.roleName);
      if (!role) {
        throw new Error(`Rol no encontrado: ${userData.roleName}`);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await User.create(
        {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          username: userData.username,
          roleId: role.id,
        },
        { transaction: t }
      );
    }

    await t.commit();
    console.log("Usuarios, roles y permisos inicializados exitosamente.");
  } catch (error) {
    await t.rollback();
    console.error("Error al inicializar usuarios, roles y permisos:", error);
  }
}

// Ejecutar el script
initializeUsersWithRolesAndPermissions();