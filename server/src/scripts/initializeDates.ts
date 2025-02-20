import dotenv from "dotenv";
import sequelize from "../infrastructure/database/db";
import Category from "../modules/category/Category";
import CareerType from "../modules/careerType/CareerType";
import { CourseCategory } from "../modules/course/Course";
import Course from "../modules/course/Course";
import Section from "../modules/section/Section";
import Content from "../modules/content/Content";
import HeaderSection from "../modules/headerSection/HeaderSection";
import { link } from "fs";
import { text } from "stream/consumers";

// Carga las variables de entorno del archivo .env
dotenv.config();

//Datos de ejemplo para las categorias
const categorias = [
  {
    name: "Inteligencia Artificial",
    description: "Categoría relacionada con avances en IA y machine learning.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/843/843285.png", // Icono de IA
  },
  {
    name: "Blockchain",
    description: "Categoría relacionada con tecnología blockchain y criptomonedas.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/7339/7339066.png", // Icono de blockchain
  },
  {
    name: "Realidad Virtual",
    description: "Categoría relacionada con VR y experiencias inmersivas.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/3688/3688146.png", // Icono de VR
  },
  {
    name: "Internet de las Cosas",
    description: "Categoría relacionada con dispositivos conectados y automatización.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/2956/2956854.png", // Icono de IoT
  },
  {
    name: "Ciberseguridad",
    description: "Categoría relacionada con protección de datos y sistemas.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/3716/3716407.png", // Icono de ciberseguridad
  },
  {
    name: "Desarrollo Web",
    description: "Categoría relacionada con tecnologías y frameworks para desarrollo web.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/732/732212.png", // Icono de desarrollo web
  },
  {
    name: "Cloud Computing",
    description: "Categoría relacionada con servicios en la nube y almacenamiento remoto.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5333/5333816.png", // Icono de cloud computing
  },
  {
    name: "Big Data",
    description: "Categoría relacionada con análisis y gestión de grandes volúmenes de datos.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/2300/2300443.png", // Icono de big data
  },
  {
    name: "Robótica",
    description: "Categoría relacionada con robots y automatización industrial.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/1633/1633641.png", // Icono de robótica
  },
  {
    name: "5G",
    description: "Categoría relacionada con redes móviles de quinta generación.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/4690/4690299.png", // Icono de 5G
  },
];


//Datos de ejmplos para las carreras
const carreras = [
  {
    name: "Ingeniería en Software",
    description: "Carrera enfocada en el desarrollo de software y tecnología.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/2721/2721263.png", // Icono de desarrollo de software
  },
  {
    name: "Ciencia de Datos",
    description: "Carrera enfocada en el análisis y gestión de grandes volúmenes de datos.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/4149/4149643.png", // Icono de data science
  },
  {
    name: "Ingeniería en Ciberseguridad",
    description: "Carrera dedicada a la protección de sistemas y datos contra amenazas digitales.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png", // Icono de ciberseguridad
  },
  {
    name: "Ingeniería en Robótica",
    description: "Carrera que combina mecánica, electrónica y software para crear robots.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/1260/1260092.png", // Icono de robótica
  },
  {
    name: "Ingeniería en Cloud Computing",
    description: "Carrera especializada en servicios en la nube y arquitecturas distribuidas.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/4144/4144438.png", // Icono de cloud computing
  },
  {
    name: "Ingeniería en Desarrollo de Videojuegos",
    description: "Carrera enfocada en la creación de videojuegos y experiencias interactivas.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/599/599502.png", // Icono de videojuegos
  },
];

// Datos de ejemplo para cursos
const curso1 = {
  title: "Curso de Node.js",
  image:
    "https://logos-download.com/wp-content/uploads/2016/09/Node_logo_NodeJS.png",
  summary: "Aprende Node.js desde cero.",
  about: "Este curso cubre los fundamentos y conceptos avanzados de Node.js.",
  careerTypeId: 1,
  prerequesites: [
    "Conocimientos fundamentales sobre el lenguaje de javascript",
  ],
  learningOutcomes: ["Manejo de Express", "Uso de Sequelize"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [1, 2],
  sections: [
    {
      title: "Introducción al Curso",
      description: "Esta sección introduce los fundamentos del curso.",
      courseId: 1,
      coverImage: "https://example.com/cover1.jpg",
      moduleType: "Intermedio",
      contents: [
        {
          title: "Introducción al curso",
          text: "Video explicativo",
          duration: 30,
          position: 1,
          sectionId: 1,
        },
        {
          title: "Prueba de conocimientos en JavaScript",
          text: "Este cuestionario evalúa tus conocimientos básicos sobre JavaScript.",
          quiz: [
            {
              question:
                "¿Cuál de las siguientes opciones NO es un tipo de dato en JavaScript?",
              answers: [
                { answer: "String", isCorrect: false },
                { answer: "Boolean", isCorrect: false },
                { answer: "Character", isCorrect: true },
                { answer: "Number", isCorrect: false },
              ],
            },
            {
              question:
                "¿Cómo se declara una variable en JavaScript usando ES6?",
              answers: [
                { answer: "var myVar = 10;", isCorrect: false },
                { answer: "let myVar = 10;", isCorrect: true },
                { answer: "const myVar;", isCorrect: false },
                { answer: "variable myVar = 10;", isCorrect: false },
              ],
            },
          ],
          duration: 15,
          position: 1,
          sectionId: 1,
        },
      ],
    },
  ],
};

const curso2 = {
  title: "Curso de React.js",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  summary: "Aprende React.js desde cero.",
  about: "Este curso cubre los fundamentos y conceptos avanzados de React.js, incluyendo Hooks y Context API.",
  careerTypeId: 2,
  prerequesites: [
    "Conocimientos básicos de HTML, CSS y JavaScript",
  ],
  learningOutcomes: ["Manejo de componentes", "Uso de React Router", "Gestión de estado con Redux"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [1, 3],
  sections: [
    {
      title: "Introducción a React",
      description: "Esta sección introduce los fundamentos de React.",
      courseId: 2,
      coverImage: "https://example.com/cover2.jpg",
      moduleType: "Introductorio",
      contents: [
        {
          title: "¿Qué es React?",
          text: "Video explicativo",
          duration: 20,
          position: 1,
          sectionId: 2,
        },
        {
          title: "Prueba de conocimientos básicos",
          text: "Este cuestionario evalúa tus conocimientos básicos sobre HTML y CSS.",
          quiz: [
            {
              question: "¿Qué significa HTML?",
              answers: [
                { answer: "Hyperlinks and Text Markup Language", isCorrect: false },
                { answer: "Home Tool Markup Language", isCorrect: false },
                { answer: "Hyper Text Markup Language", isCorrect: true },
                { answer: "Hyper Text Machine Language", isCorrect: false },
              ],
            },
            {
              question: "¿Cuál es la propiedad de CSS para cambiar el color del texto?",
              answers: [
                { answer: "text-color", isCorrect: false },
                { answer: "font-color", isCorrect: false },
                { answer: "color", isCorrect: true },
                { answer: "background-color", isCorrect: false },
              ],
            },
          ],
          duration: 10,
          position: 2,
          sectionId: 2,
        },
      ],
    },
  ],
};

const curso3 = {
  title: "Curso de Python",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
  summary: "Aprende Python desde cero.",
  about: "Este curso cubre los fundamentos de Python, incluyendo estructuras de datos, funciones y programación orientada a objetos.",
  careerTypeId: 3,
  prerequesites: [
    "Ninguno, este curso es para principiantes.",
  ],
  learningOutcomes: ["Manejo de listas y diccionarios", "Uso de funciones", "Programación orientada a objetos"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [1, 4],
  sections: [
    {
      title: "Introducción a Python",
      description: "Esta sección introduce los fundamentos de Python.",
      courseId: 3,
      coverImage: "https://example.com/cover3.jpg",
      moduleType: "Intermedio",
      contents: [
        {
          title: "¿Qué es Python?",
          text: "Video explicativo",
          duration: 25,
          position: 1,
          sectionId: 3,
        },
        {
          title: "Prueba de conocimientos básicos",
          text: "Este cuestionario evalúa tus conocimientos básicos sobre programación.",
          quiz: [
            {
              question: "¿Qué es una variable?",
              answers: [
                { answer: "Un tipo de dato", isCorrect: false },
                { answer: "Un contenedor para almacenar datos", isCorrect: true },
                { answer: "Una función", isCorrect: false },
                { answer: "Un bucle", isCorrect: false },
              ],
            },
            {
              question: "¿Qué hace la función print() en Python?",
              answers: [
                { answer: "Lee datos de entrada", isCorrect: false },
                { answer: "Imprime datos en la consola", isCorrect: true },
                { answer: "Crea una lista", isCorrect: false },
                { answer: "Define una función", isCorrect: false },
              ],
            },
          ],
          duration: 15,
          position: 2,
          sectionId: 3,
        },
      ],
    },
  ],
};

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
];

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

    //Insertar categorias y carreras
    for (const categoria of categorias) {
      await Category.create(categoria);
    }

    for (const carrera of carreras) {
      await CareerType.create(carrera);
    }

    // Insertar cursos con secciones y contenidos
    const cursos = [curso1, curso2, curso3];
    for (const curso of cursos) {
      const createdCourse = await Course.create(curso);

      const courseCategories = curso.categoryIds.map((categoryId) => ({
        courseId: createdCourse.id,
        categoryId,
      }));

      await CourseCategory.bulkCreate(courseCategories);

      for (const section of curso.sections) {
        const createdSection = await Section.create({
          ...section,
        });

        for (const content of section.contents)
          await Content.create({
            ...content,
            sectionId: createdSection.id,
          });
      }
    }

    for(const headerSection of seccionesConEncabezado){
      HeaderSection.create(headerSection)
    }


    await transaction.commit();
    console.log("Datos insertados exitosamente.");
    process.exit(0); // Finalizar el proceso con éxito
  } catch (error) {
    await transaction.rollback();
    console.error("Error al insertar datos:", error);
    process.exit(1); // Finalizar el proceso con error
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecutar la función principal
insertData();
