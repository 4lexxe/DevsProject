import dotenv from "dotenv";
import sequelize from "../infrastructure/database/db";
import Course from "../modules/course/models/Course";
import { CourseCategory } from "../modules/course/models/Course";
import Section from "../modules/course/models/Section";
import Content from "../modules/course/models/Content";
import CourseAccess from "../modules/purchase/models/CourseAccess";
import User from "../modules/user/User";
import Role from "../modules/role/Role";
import Admin from "../modules/admin/Admin";

// Carga las variables de entorno del archivo .env
dotenv.config();

// Datos de cursos para el usuario admin
const cursosAdmin = [
  {
    title: "Introducción a la Programación con JavaScript",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende los fundamentos de la programación con JavaScript desde cero.",
    about: "Este curso te llevará desde los conceptos básicos hasta la creación de aplicaciones web interactivas. Aprenderás variables, funciones, control de flujo, manipulación del DOM y mucho más. Perfecto para principiantes que quieren empezar en el mundo de la programación.",
    learningOutcomes: [
      "Entender los conceptos básicos de JavaScript",
      "Crear variables y funciones",
      "Implementar control de flujo con condicionales y bucles",
      "Manipular el DOM para crear páginas interactivas",
      "Desarrollar pequeñas aplicaciones web"
    ],
    prerequisites: ["Conocimientos básicos de HTML y CSS"],
    price: 99.99,
    isActive: true,
    isInDevelopment: false,
    categoryIds: [1, 5], // Inteligencia Artificial y Desarrollo Web
    sections: [
      {
        title: "Fundamentos de JavaScript",
        description: "Conceptos básicos del lenguaje",
        order: 1,
        contents: [
          {
            title: "¿Qué es JavaScript?",
            text: "Introducción al lenguaje de programación JavaScript. En esta lección aprenderás qué es JavaScript, para qué se utiliza y por qué es tan importante en el desarrollo web moderno.",
            duration: 15,
            position: 1
          },
          {
            title: "Variables y Tipos de Datos",
            text: "Aprende sobre variables, strings, números y booleanos en JavaScript. Descubre cómo declarar variables y trabajar con diferentes tipos de datos.",
            duration: 20,
            position: 2
          },
          {
            title: "Ejercicios Prácticos",
            text: "Practica lo aprendido con ejercicios prácticos. Resuelve problemas reales utilizando variables y tipos de datos en JavaScript.",
            duration: 30,
            position: 3
          }
        ]
      },
      {
        title: "Control de Flujo",
        description: "Condicionales y bucles",
        order: 2,
        contents: [
          {
            title: "Condicionales if/else",
            text: "Aprende a tomar decisiones en tu código usando condicionales. Descubre cómo usar if, else if y else para controlar el flujo de tu programa.",
            duration: 25,
            position: 1
          },
          {
            title: "Bucles for y while",
            text: "Repetir acciones de manera eficiente usando bucles. Aprende la diferencia entre for y while, y cuándo usar cada uno.",
            duration: 30,
            position: 2
          }
        ]
      }
    ]
  },
  {
    title: "React.js para Principiantes",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Domina React.js y crea aplicaciones web modernas.",
    about: "Aprende React.js desde cero y conviértete en un desarrollador frontend moderno. Este curso cubre componentes, hooks, estado, props, routing y mucho más. Incluye proyectos prácticos para consolidar tu aprendizaje.",
    learningOutcomes: [
      "Crear componentes reutilizables en React",
      "Manejar estado y props eficientemente",
      "Implementar hooks como useState y useEffect",
      "Crear aplicaciones de una sola página (SPA)",
      "Integrar APIs externas en aplicaciones React"
    ],
    prerequisites: ["JavaScript intermedio", "HTML y CSS"],
    price: 149.99,
    isActive: true,
    isInDevelopment: false,
    categoryIds: [5], // Desarrollo Web
    sections: [
      {
        title: "Introducción a React",
        description: "Conceptos fundamentales de React",
        order: 1,
        contents: [
          {
            title: "¿Qué es React?",
            text: "Introducción a la librería de Facebook para crear interfaces de usuario. Aprende los conceptos fundamentales y por qué React es tan popular.",
            duration: 20,
            position: 1
          },
          {
            title: "Configuración del entorno",
            text: "Instala y configura React en tu máquina. Aprende a usar Create React App y configurar tu entorno de desarrollo.",
            duration: 15,
            position: 2
          }
        ]
      },
      {
        title: "Componentes y JSX",
        description: "Aprende a crear componentes reutilizables",
        order: 2,
        contents: [
          {
            title: "Tu primer componente",
            text: "Crea tu primer componente de React desde cero. Aprende la sintaxis JSX y cómo estructurar componentes reutilizables.",
            duration: 25,
            position: 1
          },
          {
            title: "Props y Estado",
            text: "Maneja datos en tus componentes usando props y estado. Descubre cómo pasar información entre componentes.",
            duration: 35,
            position: 2
          }
        ]
      },
      {
        title: "Hooks de React",
        description: "useState, useEffect y más",
        order: 3,
        contents: [
          {
            title: "useState Hook",
            text: "Maneja el estado en componentes funcionales usando el hook useState. Aprende a actualizar y gestionar el estado local.",
            duration: 30,
            position: 1
          },
          {
            title: "useEffect Hook",
            text: "Efectos secundarios en React con useEffect. Aprende a manejar llamadas a APIs, suscripciones y limpieza de recursos.",
            duration: 25,
            position: 2
          }
        ]
      }
    ]
  },
  {
    title: "Python para Ciencia de Datos",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende Python aplicado a ciencia de datos.",
    about: "Domina Python para ciencia de datos con este curso completo. Aprenderás pandas para manipulación de datos, numpy para cálculos numéricos, matplotlib para visualización y técnicas de análisis de datos reales. Incluye proyectos prácticos con datasets reales.",
    learningOutcomes: [
      "Manipular datos con pandas de manera eficiente",
      "Realizar cálculos numéricos con numpy",
      "Crear visualizaciones impactantes con matplotlib",
      "Analizar datasets reales y extraer insights",
      "Implementar pipelines de procesamiento de datos"
    ],
    prerequisites: ["Python básico", "Matemáticas básicas"],
    price: 199.99,
    isActive: true,
    isInDevelopment: false,
    categoryIds: [1, 7], // Inteligencia Artificial y Big Data
    sections: [
      {
        title: "Fundamentos de Python",
        description: "Sintaxis básica y estructuras de datos",
        order: 1,
        contents: [
          {
            title: "Introducción a Python",
            text: "¿Por qué Python para ciencia de datos? Descubre las ventajas de Python y por qué es el lenguaje preferido para análisis de datos.",
            duration: 18,
            position: 1
          },
          {
            title: "Listas y Diccionarios",
            text: "Estructuras de datos fundamentales en Python. Aprende a trabajar con listas, diccionarios y sus métodos más importantes.",
            duration: 22,
            position: 2
          }
        ]
      },
      {
        title: "Bibliotecas para Ciencia de Datos",
        description: "Pandas, NumPy y Matplotlib",
        order: 2,
        contents: [
          {
            title: "Introducción a Pandas",
            text: "Manipulación de datos con Pandas. Aprende a cargar, limpiar y transformar datos usando la librería más popular para análisis de datos.",
            duration: 35,
            position: 1
          },
          {
            title: "Visualización con Matplotlib",
            text: "Crea gráficos impresionantes con Matplotlib. Aprende a visualizar tus datos de manera efectiva y profesional.",
            duration: 28,
            position: 2
          }
        ]
      }
    ]
  }
];

async function createAdminCourses() {
  const transaction = await sequelize.transaction();

  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    // Buscar el usuario admin (superadmin)
    const adminUser = await User.findOne({
      include: [{
        model: Role,
        as: 'Role',
        where: { name: 'superadmin' }
      }]
    });

    if (!adminUser) {
      throw new Error('No se encontró el usuario admin');
    }

    // Buscar o crear el Admin asociado
    let adminRecord = await Admin.findOne({ where: { userId: adminUser.id } });
    if (!adminRecord) {
      adminRecord = await Admin.create({
        userId: adminUser.id,
        isActive: true
      }, { transaction });
    }

    console.log(`Usuario admin encontrado: ${adminUser.name} (ID: ${adminUser.id})`);
    console.log(`Admin record ID: ${adminRecord.id}`);

    // Crear cursos para el admin
    for (const cursoData of cursosAdmin) {
      console.log(`Creando curso: ${cursoData.title}`);
      
      // Extraer categoryIds y sections antes de crear el curso
      const { categoryIds, sections, ...courseFields } = cursoData;
      
      // Crear el curso con adminId
      const createdCourse = await Course.create({
        ...courseFields,
        adminId: adminRecord.id
      }, { transaction });
      console.log(`Curso creado con ID: ${createdCourse.id}`);

      // Crear las relaciones curso-categoría
      if (categoryIds && categoryIds.length > 0) {
        const courseCategories = categoryIds.map((categoryId: number) => ({
          courseId: createdCourse.id,
          categoryId,
        }));
        await CourseCategory.bulkCreate(courseCategories, { transaction });
        console.log(`Categorías asignadas: ${categoryIds.join(', ')}`);
      }

      // Crear las secciones del curso
      if (sections && sections.length > 0) {
        for (const sectionData of sections) {
          // Extraer contents antes de crear la sección
          const { contents, ...sectionFields } = sectionData;
          
          const createdSection = await Section.create({
            ...sectionFields,
            courseId: createdCourse.id,
          }, { transaction });
          console.log(`Sección creada: ${createdSection.title}`);

          // Crear los contenidos de la sección
          if (contents && contents.length > 0) {
            for (const contentData of contents) {
              const createdContent = await Content.create({
                ...contentData,
                sectionId: createdSection.id,
              }, { transaction });
              console.log(`Contenido creado: ${createdContent.title}`);
            }
          }
        }
      }

      // Crear acceso al curso para el admin (para poder probar el progreso)
      await CourseAccess.create({
        userId: adminUser.id,
        courseId: createdCourse.id,
        accessToken: `admin_access_${createdCourse.id}_${Date.now()}`,
        grantedAt: new Date(),
        revokedAt: null,
        revokeReason: null
      }, { transaction });
      console.log(`Acceso al curso creado para el admin`);
    }

    await transaction.commit();
    console.log("\n✅ Cursos del admin creados exitosamente.");
    console.log(`📚 Total de cursos creados: ${cursosAdmin.length}`);
    console.log(`👤 Instructor: ${adminUser.name}`);
    console.log(`🔑 Accesos de curso creados para testing del progreso`);
    
    process.exit(0); // Finalizar el proceso con éxito
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error al crear cursos del admin:", error);
    process.exit(1); // Finalizar el proceso con error
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecutar la función principal
createAdminCourses();