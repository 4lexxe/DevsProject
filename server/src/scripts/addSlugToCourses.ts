/**
 * Script para agregar el campo slug a la tabla Courses
 * Ejecutar con: npx ts-node src/scripts/addSlugToCourses.ts
 */

import sequelize from "../infrastructure/database/db";
import { DataTypes, Op } from "sequelize";
import Course from "../modules/course/models/Course";
import { generateSlug, generateUniqueSlug } from "../shared/utils/slugGenerator";

async function addSlugToCourses() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida");

    // Agregar la columna slug si no existe
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      await queryInterface.addColumn("Courses", "slug", {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      });
      console.log(" Columna 'slug' agregada a la tabla Courses");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" La columna 'slug' ya existe en la tabla Courses");
      } else {
        throw error;
      }
    }

    // Generar slugs para cursos existentes que no tengan slug
    const courses = await Course.findAll({
      where: {
        slug: null,
      },
    });

    console.log(` Encontrados ${courses.length} cursos sin slug`);

    for (const course of courses) {
      // Obtener todos los slugs existentes
      const existingSlugs = await Course.findAll({
        attributes: ["slug"],
        where: {
          slug: { [Op.ne]: null },
        },
        raw: true,
      }).then((results) => results.map((r: any) => r.slug).filter(Boolean));

      // Generar slug único
      const slug = generateUniqueSlug(course.title, existingSlugs);

      // Actualizar el curso
      await course.update({ slug });
      console.log(` Slug generado para curso "${course.title}": ${slug}`);
    }

    // Ahora hacer que el campo sea NOT NULL (opcional, descomentar si quieres)
    // await queryInterface.changeColumn("Courses", "slug", {
    //   type: sequelize.Sequelize.DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // });

    console.log(" Proceso completado exitosamente");
  } catch (error) {
    console.error(" Error:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el script
addSlugToCourses()
  .then(() => {
    console.log(" Script ejecutado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Error al ejecutar el script:", error);
    process.exit(1);
  });
