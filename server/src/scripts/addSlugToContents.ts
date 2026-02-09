/**
 * Script para agregar el campo slug a la tabla Contents
 * Ejecutar con: npx ts-node src/scripts/addSlugToContents.ts
 */

import sequelize from "../infrastructure/database/db";
import { DataTypes, Op } from "sequelize";
import Content from "../modules/course/models/Content";
import { generateSlug, generateUniqueSlug } from "../shared/utils/slugGenerator";

async function addSlugToContents() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida");

    // Agregar la columna slug si no existe
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      await queryInterface.addColumn("Contents", "slug", {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      });
      console.log(" Columna 'slug' agregada a la tabla Contents");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" La columna 'slug' ya existe en la tabla Contents");
      } else {
        throw error;
      }
    }

    // Crear índice único para slug si no existe
    try {
      await queryInterface.addIndex("Contents", ["slug"], {
        unique: true,
        name: "Contents_slug_unique",
      });
      console.log(" Índice único creado para 'slug' en la tabla Contents");
    } catch (error: any) {
      if (error.name === "SequelizeDatabaseError" && error.message.includes("already exists")) {
        console.log(" El índice único para 'slug' ya existe");
      } else {
        throw error;
      }
    }

    // Generar slugs para contenidos existentes que no tengan slug
    const contents = await Content.findAll({
      where: {
        slug: null,
      },
    });

    console.log(` Encontrados ${contents.length} contenidos sin slug`);

    for (const content of contents) {
      // Obtener todos los slugs existentes
      const existingSlugs = await Content.findAll({
        attributes: ["slug"],
        where: {
          slug: { [Op.ne]: null },
        },
        raw: true,
      }).then((results) => results.map((r: any) => r.slug).filter(Boolean));

      // Generar slug único
      const slug = generateUniqueSlug(content.title, existingSlugs);

      // Actualizar el contenido
      await content.update({ slug });
      console.log(` Slug generado para contenido "${content.title}": ${slug}`);
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
addSlugToContents()
  .then(() => {
    console.log(" Script ejecutado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Error al ejecutar el script:", error);
    process.exit(1);
  });
