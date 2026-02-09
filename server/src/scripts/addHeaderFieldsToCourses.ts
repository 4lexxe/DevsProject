import sequelize from '../infrastructure/database/db';

/**
 * Script para agregar las columnas del header dinámico a la tabla Courses
 * Este script es seguro y no elimina datos existentes
 */
async function addHeaderFieldsToCourses() {
  try {
    console.log(' Iniciando agregado de columnas de header dinámico...');

    // Verificar si las columnas ya existen antes de agregarlas
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('Courses');

    const columnsToAdd = [
      {
        name: 'headerType',
        definition: {
          type: 'VARCHAR(255)',
          allowNull: true,
          defaultValue: 'default',
        },
      },
      {
        name: 'headerTitle',
        definition: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
      },
      {
        name: 'headerSubtitle',
        definition: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
      },
      {
        name: 'headerDescription',
        definition: {
          type: 'TEXT',
          allowNull: true,
        },
      },
      {
        name: 'headerButtonText',
        definition: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
      },
      {
        name: 'headerButtonLink',
        definition: {
          type: 'VARCHAR(255)',
          allowNull: true,
        },
      },
      {
        name: 'techStack',
        definition: {
          type: 'TEXT[]',
          allowNull: true,
        },
      },
      {
        name: 'customHeaderContent',
        definition: {
          type: 'TEXT',
          allowNull: true,
        },
      },
      {
        name: 'affiliatedCourseId',
        definition: {
          type: 'BIGINT',
          allowNull: true,
          references: {
            model: 'Courses',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
      },
    ];

    for (const column of columnsToAdd) {
      if (!tableDescription[column.name]) {
        console.log(`   Agregando columna: ${column.name}`);
        await queryInterface.addColumn('Courses', column.name, column.definition);
        console.log(`   Columna ${column.name} agregada exitosamente`);
      } else {
        console.log(`    Columna ${column.name} ya existe, omitiendo...`);
      }
    }

    // Agregar índice para affiliatedCourseId si no existe
    try {
      await queryInterface.addIndex('Courses', ['affiliatedCourseId'], {
        name: 'courses_affiliated_course_id_idx',
        ifNotExists: true,
      });
      console.log('   Índice para affiliatedCourseId agregado');
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        console.log('    No se pudo agregar el índice (puede que ya exista)');
      }
    }

    console.log(' Proceso completado exitosamente');
  } catch (error) {
    console.error(' Error al agregar columnas:', error);
    throw error;
  }
}

// Ejecutar el script
if (require.main === module) {
  addHeaderFieldsToCourses()
    .then(() => {
      console.log(' Script ejecutado correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error(' Error fatal:', error);
      process.exit(1);
    });
}

export default addHeaderFieldsToCourses;
