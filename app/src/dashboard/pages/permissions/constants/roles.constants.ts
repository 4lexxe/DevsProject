// Nombres de los roles del sistema que no pueden ser modificados
// Estos nombres deben coincidir exactamente con los definidos en rolesIniciales del backend
export const SYSTEM_ROLES = ['student', 'instructor', 'moderator', 'admin', 'superadmin'];

// Descripciones de los roles del sistema según se definen en el backend
export const SYSTEM_ROLES_DESCRIPTIONS = {
  student: 'Estudiante del sistema',
  instructor: 'Instructor de cursos',
  moderator: 'Moderador de la comunidad',
  admin: 'Administrador del sistema',
  superadmin: 'Super administrador con acceso total'
};