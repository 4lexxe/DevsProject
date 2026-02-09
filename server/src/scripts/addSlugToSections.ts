/**
 * Script para agregar el campo slug a la tabla Sections
 * Ejecutar con: npx ts-node src/scripts/addSlugToSections.ts
 */

import sequelize from "../infrastructure/database/db";
import { DataTypes, Op } from "sequelize";
import Section from "../modules/course/models/Section";
import { generateSlug, generateUniqueSlug } from "../shared/utils/slugGenerator";

async function addSlugToSections() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida");

    // Agregar la columna slug si no existe
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      await queryInterface.addColumn("Sections", "slug", {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      });
      console.log(" Columna 'slug' agregada a la tabla Sections");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" La columna 'slug' ya existe en la tabla Sections");
      } else {
        throw error;
      }
    }

    // Crear índice único para slug si no existe
    try {
      await queryInterface.addIndex("Sections", ["slug"], {
        unique: true,
        name: "Sections_slug_unique",
      });
      console.log(" Índice único creado para 'slug' en la tabla Sections");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" El índice único para 'slug' ya existe");
      } else {
        throw error;
      }
    }

    // Generar slugs para secciones existentes que no tengan slug
    const sections = await Section.findAll({
      where: {
        slug: null,
      },
    });

    console.log(` Encontradas ${sections.length} secciones sin slug`);

    for (const section of sections) {
      // Obtener todos los slugs existentes
      const existingSlugs = await Section.findAll({
        attributes: ["slug"],
        where: {
          slug: { [Op.ne]: null },
        },
        raw: true,
      }).then((results) => results.map((r: any) => r.slug).filter(Boolean));

      // Generar slug único
      const slug = generateUniqueSlug(section.title, existingSlugs);

      // Actualizar la sección
      await section.update({ slug });
      console.log(` Slug generado para sección "${section.title}": ${slug}`);
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
addSlugToSections()
  .then(() => {
    console.log(" Script ejecutado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Error al ejecutar el script:", error);
    process.exit(1);
  });
