import dotenv from "dotenv";
import sequelize from "../infrastructure/database/db";
import Category from "../modules/category/Category";
import CareerType from "../modules/careerType/CareerType";
import Course from "../modules/course/Course";
import Section from "../modules/section/Section";
import TextContent from "../modules/content/models/TextContent";
import QuizContent from "../modules/content/models/QuizContent";
import HeaderSection from "../modules/headerSection/HeaderSection";

// Carga las variables de entorno del archivo .env
dotenv.config();

//Datos de ejemplo para las categorias
const categorias = [
  {
    name: "Inteligencia Artificial",
    description: "Categoría relacionada con avances en IA y machine learning.",
    isActive: true
  },
  {
    name: "Blockchain",
    description: "Categoría relacionada con tecnología blockchain y criptomonedas.",
    isActive: true
  },
  {
    name: "Realidad Virtual",
    description: "Categoría relacionada con VR y experiencias inmersivas.",
    isActive: false
  },
  {
    name: "Internet de las Cosas",
    description: "Categoría relacionada con dispositivos conectados y automatización.",
    isActive: true
  },
  {
    name: "Ciberseguridad",
    description: "Categoría relacionada con protección de datos y sistemas.",
    isActive: true
  },
  {
    name: "Desarrollo Web",
    description: "Categoría relacionada con tecnologías y frameworks para desarrollo web.",
    isActive: true
  },
  {
    name: "Cloud Computing",
    description: "Categoría relacionada con servicios en la nube y almacenamiento remoto.",
    isActive: true
  },
  {
    name: "Big Data",
    description: "Categoría relacionada con análisis y gestión de grandes volúmenes de datos.",
    isActive: true
  },
  {
    name: "Robótica",
    description: "Categoría relacionada con robots y automatización industrial.",
    isActive: true
  },
  {
    name: "5G",
    description: "Categoría relacionada con redes móviles de quinta generación.",
    isActive: false
  }
];

//Datos de ejmplos para las carreras
const carreras = [
  {
    name: "Ingeniería en Software",
    description: "Carrera enfocada en el desarrollo de software y tecnología.",
    isActive: true
  },
  {
    name: "Ciencia de Datos",
    description: "Carrera enfocada en el análisis y gestión de grandes volúmenes de datos.",
    isActive: true
  },
  {
    name: "Ingeniería en Ciberseguridad",
    description: "Carrera dedicada a la protección de sistemas y datos contra amenazas digitales.",
    isActive: false
  },
  {
    name: "Ingeniería en Robótica",
    description: "Carrera que combina mecánica, electrónica y software para crear robots.",
    isActive: true
  },
  {
    name: "Ingeniería en Cloud Computing",
    description: "Carrera especializada en servicios en la nube y arquitecturas distribuidas.",
    isActive: true
  },
  {
    name: "Ingeniería en Desarrollo de Videojuegos",
    description: "Carrera enfocada en la creación de videojuegos y experiencias interactivas.",
    isActive: false
  },
];

// Datos de ejemplo para cursos
const curso1 = {
  title: "Curso de Node.js",
  image: "https://example.com/nodejs.png",
  summary: "Aprende Node.js desde cero.",
  about: "Este curso cubre los fundamentos y conceptos avanzados de Node.js.",
  careerTypeId: 1,
  learningOutcomes: ["Manejo de Express", "Uso de Sequelize"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [1, 3],
  sections: [
    {
      title: "Introducción al Curso",
      description: "Esta sección introduce los fundamentos del curso.",
      courseId: 1,
      coverImage: "https://example.com/cover1.jpg",
      moduleType: "Intermedio", 
      textContent: {
        content: "https://example.com/video1.mp4",
        title: "Introducción al curso",
        duration: 300,
        position: 1,
        sectionId: 1
      },
      quizContent: {
        title: "Prueba de conocimientos en JavaScript",
        content: "Este cuestionario evalúa tus conocimientos básicos sobre JavaScript.",
        questions: [
          {
            question: "¿Cuál de las siguientes opciones NO es un tipo de dato en JavaScript?",
            answers: [
              { answer: "String", isCorrect: false },
              { answer: "Boolean", isCorrect: false },
              { answer: "Character", isCorrect: true },
              { answer: "Number", isCorrect: false }
            ]
          },
          {
            question: "¿Cómo se declara una variable en JavaScript usando ES6?",
            answers: [
              { answer: "var myVar = 10;", isCorrect: false },
              { answer: "let myVar = 10;", isCorrect: true },
              { answer: "const myVar;", isCorrect: false },
              { answer: "variable myVar = 10;", isCorrect: false }
            ]
          }
        ],
        duration: 15,
        position: 1,
        sectionId: 1
      }
    },
    {
      title: "Configuración del Entorno",
      description: "Aprende a configurar tu entorno de desarrollo para Node.js.",
      courseId: 1,
      coverImage: "https://example.com/cover2.jpg",
      moduleType: "Intermedio",
      textContent: {
        content: "https://example.com/video2.mp4",
        title: "Instalación de Node.js",
        duration: 450,
        position: 2,
        sectionId: 2
      },
      quizContent: {
        title: "Prueba de configuración de Node.js",
        content: "Este cuestionario evalúa tus conocimientos sobre la configuración de Node.js.",
        questions: [
          {
            question: "¿Qué comando se usa para instalar Node.js desde la terminal?",
            answers: [
              { answer: "npm install node", isCorrect: false },
              { answer: "sudo apt-get install nodejs", isCorrect: true },
              { answer: "brew install node", isCorrect: true },
              { answer: "yarn add node", isCorrect: false }
            ]
          },
          {
            question: "¿Qué comando verifica la versión de Node.js instalada?",
            answers: [
              { answer: "node --version", isCorrect: true },
              { answer: "npm --version", isCorrect: false },
              { answer: "node -v", isCorrect: true },
              { answer: "npm -v", isCorrect: false }
            ]
          }
        ],
        duration: 20,
        position: 2,
        sectionId: 2
      }
    }
  ]
};

const curso2 = {
  title: "Curso de React",
  image: "https://example.com/react.png",
  summary: "Aprende React desde cero.",
  about: "Este curso cubre los fundamentos y conceptos avanzados de React.",
  careerTypeId: 1,
  learningOutcomes: ["Componentes", "Hooks", "Context API"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [2, 4],
  sections: [
    {
      title: "Introducción a React",
      description: "Esta sección introduce los fundamentos de React.",
      courseId: 2,
      coverImage: "https://example.com/cover3.jpg",
      moduleType: "Intermedio",
      textContent: {
        content: "https://example.com/video3.mp4",
        title: "¿Qué es React?",
        duration: 300,
        position: 1,
        sectionId: 3
      },
      quizContent: {
        title: "Prueba de conocimientos básicos de React",
        content: "Este cuestionario evalúa tus conocimientos básicos sobre React.",
        questions: [
          {
            question: "¿Qué es un componente en React?",
            answers: [
              { answer: "Una función que retorna HTML", isCorrect: true },
              { answer: "Un archivo de configuración", isCorrect: false },
              { answer: "Un tipo de dato", isCorrect: false },
              { answer: "Un framework de backend", isCorrect: false }
            ]
          },
          {
            question: "¿Qué hook se usa para manejar el estado en React?",
            answers: [
              { answer: "useEffect", isCorrect: false },
              { answer: "useState", isCorrect: true },
              { answer: "useContext", isCorrect: false },
              { answer: "useReducer", isCorrect: false }
            ]
          }
        ],
        duration: 15,
        position: 1,
        sectionId: 3
      }
    },
    {
      title: "Componentes y Props",
      description: "Aprende a crear y usar componentes en React.",
      courseId: 2,
      coverImage: "https://example.com/cover4.jpg",
      moduleType: "Intermedio",
      textContent: {
        content: "https://example.com/video4.mp4",
        title: "Creación de componentes",
        duration: 450,
        position: 2,
        sectionId: 4
      },
      quizContent: {
        title: "Prueba de componentes y props",
        content: "Este cuestionario evalúa tus conocimientos sobre componentes y props en React.",
        questions: [
          {
            question: "¿Cómo se pasa una prop a un componente?",
            answers: [
              { answer: "<Component prop={value} />", isCorrect: true },
              { answer: "<Component {value} />", isCorrect: false },
              { answer: "<Component props={value} />", isCorrect: false },
              { answer: "<Component value={prop} />", isCorrect: false }
            ]
          },
          {
            question: "¿Qué es un componente funcional?",
            answers: [
              { answer: "Una función que retorna JSX", isCorrect: true },
              { answer: "Una clase que extiende React.Component", isCorrect: false },
              { answer: "Un archivo de estilo", isCorrect: false },
              { answer: "Un tipo de hook", isCorrect: false }
            ]
          }
        ],
        duration: 20,
        position: 2,
        sectionId: 4
      }
    }
  ]
};

const curso3 = {
  title: "Curso de Python",
  image: "https://example.com/python.png",
  summary: "Aprende Python desde cero.",
  about: "Este curso cubre los fundamentos y conceptos avanzados de Python.",
  careerTypeId: 1,
  learningOutcomes: ["Manejo de listas", "Uso de funciones", "Programación orientada a objetos"],
  isActive: true,
  isInDevelopment: false,
  adminId: 1,
  categoryIds: [5, 6],
  sections: [
    {
      title: "Introducción a Python",
      description: "Esta sección introduce los fundamentos de Python.",
      courseId: 3,
      coverImage: "https://example.com/cover5.jpg",
      moduleType: "Intermedio",
      textContent: {
        content: "https://example.com/video5.mp4",
        title: "¿Qué es Python?",
        duration: 300,
        position: 1,
        sectionId: 5
      },
      quizContent: {
        title: "Prueba de conocimientos básicos de Python",
        content: "Este cuestionario evalúa tus conocimientos básicos sobre Python.",
        questions: [
          {
            question: "¿Qué tipo de lenguaje es Python?",
            answers: [
              { answer: "Compilado", isCorrect: false },
              { answer: "Interpretado", isCorrect: true },
              { answer: "Ensamblador", isCorrect: false },
              { answer: "Binario", isCorrect: false }
            ]
          },
          {
            question: "¿Cómo se declara una función en Python?",
            answers: [
              { answer: "function myFunction()", isCorrect: false },
              { answer: "def myFunction():", isCorrect: true },
              { answer: "func myFunction()", isCorrect: false },
              { answer: "fn myFunction()", isCorrect: false }
            ]
          }
        ],
        duration: 15,
        position: 1,
        sectionId: 5
      }
    },
    {
      title: "Listas y Diccionarios",
      description: "Aprende a manejar listas y diccionarios en Python.",
      courseId: 3,
      coverImage: "https://example.com/cover6.jpg",
      moduleType: "Intermedio",
      textContent: {
        content: "https://example.com/video6.mp4",
        title: "Manipulación de listas",
        duration: 450,
        position: 2,
        sectionId: 6
      },
      quizContent: {
        title: "Prueba de listas y diccionarios",
        content: "Este cuestionario evalúa tus conocimientos sobre listas y diccionarios en Python.",
        questions: [
          {
            question: "¿Cómo se accede al primer elemento de una lista en Python?",
            answers: [
              { answer: "lista[0]", isCorrect: true },
              { answer: "lista[1]", isCorrect: false },
              { answer: "lista.first()", isCorrect: false },
              { answer: "lista.get(0)", isCorrect: false }
            ]
          },
          {
            question: "¿Qué método se usa para agregar un elemento a una lista?",
            answers: [
              { answer: "lista.add()", isCorrect: false },
              { answer: "lista.append()", isCorrect: true },
              { answer: "lista.insert()", isCorrect: false },
              { answer: "lista.push()", isCorrect: false }
            ]
          }
        ],
        duration: 20,
        position: 2,
        sectionId: 6
      }
    }
  ]
};


// Datos de ejemplo para secciones con encabezado
const seccionesConEncabezado = [
  /* {
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
  } */
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
      for (const section of curso.sections) {
        const createdSection = await Section.create({ ...section, courseId: createdCourse.id });
        await TextContent.create({ ...section.textContent, sectionId: createdSection.id });
        await QuizContent.create({ ...section.quizContent, sectionId: createdSection.id });
      }
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