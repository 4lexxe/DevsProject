import dotenv from "dotenv";
import sequelize from "../infrastructure/database/db";
import Course from "../modules/course/Course";
import Section from "../modules/section/Section";
import Content from "../modules/content/Content";
import HeaderSection from "../modules/headerSection/HeaderSection";

// Carga las variables de entorno del archivo .env
dotenv.config();

// Datos de ejemplo para cursos
const cursos = [
  {
    id: 1,
    title: "Introducción a la Programación",
    image: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende los fundamentos de la programación desde cero.",
    category: "Desarrollo de Software",
    about: "Este curso te introduce a los conceptos básicos de la programación, incluyendo variables, condicionales y bucles.",
    relatedCareerType: "Desarrollo de Software",
    learningOutcomes: [
      "Entenderás los conceptos básicos de la programación.",
      "Serás capaz de escribir programas simples en un lenguaje de programación.",
    ],
    isActive: true,
    isInDevelopment: true,
    adminId: 1,
  },
  {
    id: 2,
    title: "Diseño Gráfico con Adobe Illustrator",
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Domina las herramientas esenciales de Adobe Illustrator para crear diseños profesionales.",
    category: "Arte y Diseño",
    about: "Este curso te enseñará a utilizar Adobe Illustrator para crear ilustraciones, logotipos y diseños vectoriales.",
    relatedCareerType: "Diseño Gráfico",
    learningOutcomes: [
      "Aprenderás a utilizar las herramientas básicas de Adobe Illustrator.",
      "Serás capaz de crear diseños vectoriales profesionales.",
    ],
    isActive: true,
    isInDevelopment: true,
    adminId: 1,
  },
  {
    id: 3,
    title: "Finanzas Personales",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende a gestionar tus finanzas personales de manera efectiva.",
    category: "Finanzas",
    about: "Este curso cubre conceptos clave como presupuestos, ahorro, inversión y manejo de deudas.",
    relatedCareerType: "Finanzas",
    learningOutcomes: [
      "Aprenderás a crear y gestionar un presupuesto personal.",
      "Entenderás los principios básicos de inversión y ahorro.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 4,
    title: "Inglés para Principiantes",
    image: "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende inglés desde cero con este curso diseñado para principiantes.",
    category: "Idiomas",
    about: "Este curso te introduce al vocabulario básico, gramática y conversaciones en inglés.",
    relatedCareerType: "Idiomas",
    learningOutcomes: [
      "Aprenderás vocabulario y gramática básica en inglés.",
      "Serás capaz de mantener conversaciones simples en inglés.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 5,
    title: "Cocina Internacional",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Descubre recetas de todo el mundo y mejora tus habilidades culinarias.",
    category: "Cocina",
    about: "Este curso te enseñará a preparar platos típicos de diferentes culturas, desde Italia hasta Japón.",
    relatedCareerType: "Gastronomía",
    learningOutcomes: [
      "Aprenderás a preparar platos internacionales.",
      "Mejorarás tus técnicas de cocina y presentación de platos.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 6,
    title: "Fotografía de Retratos",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende a capturar retratos impresionantes con técnicas profesionales.",
    category: "Fotografía",
    about: "Este curso cubre técnicas de iluminación, composición y edición para retratos.",
    relatedCareerType: "Fotografía",
    learningOutcomes: [
      "Aprenderás a utilizar la iluminación natural y artificial para retratos.",
      "Serás capaz de editar retratos en Photoshop y Lightroom.",
    ],
    isActive: true,
    isInDevelopment: true,
    adminId: 1,
  },
  {
    id: 7,
    title: "Introducción a la Inteligencia Artificial",
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Descubre los fundamentos de la inteligencia artificial y sus aplicaciones.",
    category: "Tecnología",
    about: "Este curso introduce conceptos clave de IA, como machine learning, redes neuronales y procesamiento de lenguaje natural.",
    relatedCareerType: "Inteligencia Artificial",
    learningOutcomes: [
      "Entenderás los conceptos básicos de la inteligencia artificial.",
      "Aprenderás sobre las aplicaciones prácticas de la IA.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 8,
    title: "Yoga y Meditación",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Mejora tu bienestar físico y mental con técnicas de yoga y meditación.",
    category: "Salud y Bienestar",
    about: "Este curso te enseñará posturas de yoga, técnicas de respiración y meditación para reducir el estrés.",
    relatedCareerType: "Bienestar",
    learningOutcomes: [
      "Aprenderás posturas básicas de yoga.",
      "Serás capaz de practicar técnicas de meditación para reducir el estrés.",
    ],
    isActive: true,
    isInDevelopment: true,
    adminId: 1,
  },
  {
    id: 9,
    title: "Diseño de Interiores",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende a diseñar espacios interiores funcionales y estéticos.",
    category: "Diseño",
    about: "Este curso cubre principios de diseño, selección de colores y distribución de espacios.",
    relatedCareerType: "Diseño de Interiores",
    learningOutcomes: [
      "Aprenderás a diseñar espacios interiores funcionales.",
      "Serás capaz de seleccionar colores y materiales para diferentes estilos.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 10,
    title: "Redacción Creativa",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Desarrolla tus habilidades de escritura creativa y narrativa.",
    category: "Escritura",
    about: "Este curso te enseñará técnicas para crear historias, personajes y diálogos convincentes.",
    relatedCareerType: "Escritura",
    learningOutcomes: [
      "Aprenderás a crear personajes y tramas interesantes.",
      "Serás capaz de escribir narrativas cortas y cuentos.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 11,
    title: "Introducción a la Astronomía",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Explora el universo y descubre los secretos del cosmos.",
    category: "Ciencia",
    about: "Este curso cubre conceptos básicos de astronomía, como el sistema solar, las estrellas y las galaxias.",
    relatedCareerType: "Astronomía",
    learningOutcomes: [
      "Aprenderás sobre el sistema solar y las estrellas.",
      "Entenderás los conceptos básicos de la cosmología.",
    ],
    isActive: true,
    isInDevelopment: false,
    adminId: 1,
  },
  {
    id: 12,
    title: "Marketing en Redes Sociales",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    summary: "Aprende a utilizar las redes sociales para promocionar marcas y productos.",
    category: "Marketing",
    about: "Este curso te enseñará estrategias efectivas para marketing en plataformas como Instagram, Facebook y Twitter.",
    relatedCareerType: "Marketing Digital",
    learningOutcomes: [
      "Aprenderás a crear campañas publicitarias en redes sociales.",
      "Serás capaz de analizar métricas y optimizar estrategias.",
    ],
    isActive: true,
    isInDevelopment: true,
    adminId: 1,
  },
];

// Datos de ejemplo para secciones
const secciones = [
  {
    title: "Módulo Introducción a la Programación",
    description: "Este módulo cubre los fundamentos de la programación con ejemplos prácticos.",
    courseId: 1, // Curso 1: Introducción a la Programación
    moduleType: "Módulo Introductorio",
    coverImage: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Herramientas Básicas de Illustrator",
    description: "Aprende a utilizar las herramientas esenciales de Adobe Illustrator.",
    courseId: 2, // Curso 2: Diseño Gráfico con Adobe Illustrator
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Presupuestos y Ahorro",
    description: "Aprende a crear y gestionar un presupuesto personal.",
    courseId: 3, // Curso 3: Finanzas Personales
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Vocabulario Básico en Inglés",
    description: "Aprende las palabras y frases más comunes en inglés.",
    courseId: 4, // Curso 4: Inglés para Principiantes
    moduleType: "Módulo Introductorio",
    coverImage: "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Cocina Italiana",
    description: "Descubre las recetas más populares de la cocina italiana.",
    courseId: 5, // Curso 5: Cocina Internacional
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Técnicas de Iluminación en Retratos",
    description: "Aprende a utilizar la luz natural y artificial para retratos.",
    courseId: 6, // Curso 6: Fotografía de Retratos
    moduleType: "Módulo Intermedio",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Introducción a Machine Learning",
    description: "Descubre los conceptos básicos del aprendizaje automático.",
    courseId: 7, // Curso 7: Introducción a la Inteligencia Artificial
    moduleType: "Módulo Introductorio",
    coverImage: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Posturas Básicas de Yoga",
    description: "Aprende las posturas fundamentales del yoga.",
    courseId: 8, // Curso 8: Yoga y Meditación
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Principios de Diseño de Interiores",
    description: "Aprende los fundamentos del diseño de espacios interiores.",
    courseId: 9, // Curso 9: Diseño de Interiores
    moduleType: "Módulo Introductorio",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Creación de Personajes",
    description: "Aprende a desarrollar personajes interesantes para tus historias.",
    courseId: 10, // Curso 10: Redacción Creativa
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo El Sistema Solar",
    description: "Explora los planetas y otros cuerpos celestes del sistema solar.",
    courseId: 11, // Curso 11: Introducción a la Astronomía
    moduleType: "Módulo Introductorio",
    coverImage: "https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Módulo Estrategias para Instagram",
    description: "Aprende a crear contenido efectivo para Instagram.",
    courseId: 12, // Curso 12: Marketing en Redes Sociales
    moduleType: "Módulo Básico",
    coverImage: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

// Datos de ejemplo para contenidos
const contenidos = [
  {
    type: "video",
    contentVideo: "https://example.com/video_intro_programming.mp4",
    contentVideoTitle: "Introducción a la Programación",
    duration: 120,
    position: 1,
    sectionId: 1, // Sección 1: Introducción a la Programación
  },
  {
    type: "text",
    contentText: "Adobe Illustrator es una herramienta esencial para diseñadores gráficos.",
    contentTextTitle: "Introducción a Illustrator",
    duration: 60,
    position: 1,
    sectionId: 2, // Sección 2: Herramientas Básicas de Illustrator
  },
  {
    type: "quiz",
    contentQuiz: [
      {
        question: "¿Qué es un presupuesto?",
        options: ["Un plan de gastos", "Una lista de deseos", "Un registro de ingresos"],
        correctAnswer: 0,
      },
    ],
    contentQuizTitle: "Evaluación de Finanzas Personales",
    duration: 30,
    position: 1,
    sectionId: 3, // Sección 3: Presupuestos y Ahorro
  },
  {
    type: "video",
    contentVideo: "https://example.com/video_ingles_basico.mp4",
    contentVideoTitle: "Saludos y Presentaciones en Inglés",
    duration: 90,
    position: 1,
    sectionId: 4, // Sección 4: Vocabulario Básico en Inglés
  },
  {
    type: "text",
    contentText: "La pasta es uno de los platos más emblemáticos de la cocina italiana.",
    contentTextTitle: "Receta de Pasta Italiana",
    duration: 45,
    position: 1,
    sectionId: 5, // Sección 5: Cocina Italiana
  },
  {
    type: "video",
    contentVideo: "https://example.com/video_iluminacion_fotografia.mp4",
    contentVideoTitle: "Técnicas de Iluminación en Fotografía",
    duration: 120,
    position: 1,
    sectionId: 6, // Sección 6: Técnicas de Iluminación en Retratos
  },
  {
    type: "text",
    contentText: "El machine learning es una rama de la inteligencia artificial que permite a las máquinas aprender de datos.",
    contentTextTitle: "Conceptos Básicos de Machine Learning",
    duration: 60,
    position: 1,
    sectionId: 7, // Sección 7: Introducción a Machine Learning
  },
  {
    type: "video",
    contentVideo: "https://example.com/video_yoga_basico.mp4",
    contentVideoTitle: "Posturas Básicas de Yoga",
    duration: 90,
    position: 1,
    sectionId: 8, // Sección 8: Posturas Básicas de Yoga
  },
  {
    type: "text",
    contentText: "El diseño de interiores se basa en la armonía entre funcionalidad y estética.",
    contentTextTitle: "Principios del Diseño de Interiores",
    duration: 60,
    position: 1,
    sectionId: 9, // Sección 9: Principios de Diseño de Interiores
  },
  {
    type: "quiz",
    contentQuiz: [
      {
        question: "¿Qué es un arquetipo de personaje?",
        options: ["Un modelo de personaje", "Un tipo de narrativa", "Un género literario"],
        correctAnswer: 0,
      },
    ],
    contentQuizTitle: "Evaluación de Creación de Personajes",
    duration: 30,
    position: 1,
    sectionId: 10, // Sección 10: Creación de Personajes
  },
  {
    type: "video",
    contentVideo: "https://example.com/video_sistema_solar.mp4",
    contentVideoTitle: "Explorando el Sistema Solar",
    duration: 120,
    position: 1,
    sectionId: 11, // Sección 11: El Sistema Solar
  },
  {
    type: "text",
    contentText: "Instagram es una de las plataformas más efectivas para el marketing digital.",
    contentTextTitle: "Estrategias para Instagram",
    duration: 60,
    position: 1,
    sectionId: 12, // Sección 12: Estrategias para Instagram
  },
];

// Datos de ejemplo para secciones con encabezado
const seccionesConEncabezado = [
  {
    "id": 1,
    "image": "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "title": "Bienvenido a nuestro curso",
    "slogan": "Aprende y crece con nosotros",
    "about": "Esta es una sección introductoria que describe el curso y su contenido.",
    "buttonName": "Ver curso",
    "buttonLink": "http://cursoejemplo.com",
    "adminId": 1
  },
  {
    "id": 2,
    "image": "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "title": "Descubre las herramientas de Illustrator",
    "slogan": "Crea diseños increíbles con Adobe Illustrator",
    "about": "En esta sección aprenderás a utilizar las herramientas básicas de Illustrator para crear ilustraciones y diseños profesionales.",
    "buttonName": "Ver lección",
    "buttonLink": "http://leccionejemplo.com",
    "adminId": 1
  },
  {
    "id": 3,
    "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "title": "Gestiona tus finanzas personales",
    "slogan": "Controla tus gastos y ahorra dinero",
    "about": "En este módulo aprenderás a crear un presupuesto personal, gestionar tus gastos y ahorrar para el futuro.",
    "buttonName": "Ver módulo",
    "buttonLink": "http://moduloejemplo.com",
    "adminId": 1
  },
  {
    "id": 4,
    "image": "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "title": "Aprende inglés desde cero",
    "slogan": "Mejora tus habilidades lingüísticas",
    "about": "En este módulo introductorio aprenderás vocabulario básico, frases comunes y expresiones en inglés.",
    "buttonName": "Ver módulo",
    "buttonLink": "http://moduloejemplo.com",
    "adminId": 1
  }
 ]

// Función principal para insertar datos
async function insertData() {
  const transaction = await sequelize.transaction();

  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    // Sincronizar los modelos con la base de datos
    await sequelize.sync();
    console.log("Modelos sincronizados con la base de datos.");

    // Insertar cursos con secciones, contenidos y secciones con encabezado
    for (let i = 0; i < cursos.length; i++) {
      const curso = cursos[i];
      const createdCourse = await Course.create(curso, { transaction });
      console.log(`Curso insertado: ${createdCourse.title}`);

      const seccionesCurso = secciones.filter(sec => sec.courseId === i + 1);
      for (let j = 0; j < seccionesCurso.length; j++) {
        const seccion = seccionesCurso[j];
        const createdSection = await Section.create(
          { ...seccion, courseId: createdCourse.id },
          { transaction }
        );
        console.log(`  Sección insertada: ${createdSection.title}`);

        const contenidosSeccion = contenidos.filter(cont => cont.sectionId === j + 1);
        for (const contenido of contenidosSeccion) {
          await Content.create(
            { ...contenido, sectionId: createdSection.id },
            { transaction }
          );
          console.log(`    Contenido insertado: ${contenido.type}`);
        }
      }
      const seccionesConEncabezadoCurso = seccionesConEncabezado.filter(sec => sec.id === i + 1);
      for (let j = 0; j < seccionesConEncabezadoCurso.length; j++) {
        const seccion = seccionesConEncabezadoCurso[j];
        await HeaderSection.create(
          { ...seccion, courseId: createdCourse.id },
          { transaction }
        );
        console.log(`  Sección con encabezado insertada: ${seccion.title}`);
      }
    }

    await transaction.commit();
    console.log("Datos insertados exitosamente.");
    process.exit(0); // Finalizar el proceso con éxito
  } catch (error) {
    await transaction.rollback();
    console.error("Error al insertar datos:", error);
    process.exit(1); // Finalizar el proceso con error
  }
}

// Ejecutar la función principal
insertData();