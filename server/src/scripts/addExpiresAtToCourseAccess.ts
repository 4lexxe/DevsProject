/**
 * Script para agregar el campo expiresAt a la tabla CourseAccess
 * Ejecutar con: npx ts-node src/scripts/addExpiresAtToCourseAccess.ts
 */

import sequelize from "../infrastructure/database/db";
import { DataTypes } from "sequelize";

async function addExpiresAtToCourseAccess() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida");

    const queryInterface = sequelize.getQueryInterface();
    
    try {
      await queryInterface.addColumn("CourseAccess", "expiresAt", {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Fecha de expiración del acceso (null = acceso permanente)",
      });
      console.log(" Columna 'expiresAt' agregada a la tabla CourseAccess");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" La columna 'expiresAt' ya existe en la tabla CourseAccess");
      } else {
        throw error;
      }
    }

    console.log(" Proceso completado exitosamente");
  } catch (error) {
    console.error(" Error:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el script
addExpiresAtToCourseAccess()
  .then(() => {
    console.log(" Script ejecutado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Error al ejecutar el script:", error);
    process.exit(1);
  });
