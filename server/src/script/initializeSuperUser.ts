import dotenv from "dotenv"
import { createSuperUser } from "../utils/createSuperUser"
import sequelize from "../config/db"

// Carga las variables de entorno del archivo .env
dotenv.config()

async function initializeSuperUser() {
  // Verifica si estamos en producción y si está permitida la creación del super usuario
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SUPER_USER_CREATION !== "true") {
    console.error("Super user creation is disabled in production")
    process.exit(1)
  }

  // Obtiene los datos del super usuario desde las variables de entorno
  const email = process.env.SUPER_USER_EMAIL
  const password = process.env.SUPER_USER_PASSWORD
  const name = process.env.SUPER_USER_NAME
  const username = process.env.SUPER_USER_USERNAME

  // Verifica que todas las variables necesarias estén definidas
  if (!email || !password || !name || !username) {
    console.error("Missing required environment variables for super user creation")
    process.exit(1)
  }

  try {
    // Verifica la conexión a la base de datos
    await sequelize.authenticate()
    // Crea el super usuario con los datos proporcionados
    const superUser = await createSuperUser(email, password, name, username)
    console.log("Super user created successfully:", superUser.id)
    process.exit(0)
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error("Error creating super user:", error)
    process.exit(1)
  }
}

// Ejecuta la función principal
initializeSuperUser()