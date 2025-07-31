import dotenv from "dotenv";
import sequelize from "../infrastructure/database/db";
import Category from "../modules/course/models/Category";
import CareerType from "../modules/course/models/CareerType";
import { CourseCategory } from "../modules/course/models/Course";
import Course from "../modules/course/models/Course";
import Section from "../modules/course/models/Section";
import Content from "../modules/course/models/Content";
import HeaderSection from "../modules/headerSection/HeaderSection";


// Carga las variables de entorno del archivo .env
dotenv.config();

/// Datos para los planes de membresía
/* const plansToInsert = [
  {
    name: "Plan Básico",
    description: "Plan ideal para usuarios que recién comienzan",
    totalPrice: 100,
    durationType: "días",
    duration: 1, // Duración total del ciclo de pago en meses
    features: ["Acceso básico", "Soporte Básico", "Actualizaciones mensuales"],
    isActive: true,
    accessLevel: "Básico",
    installments: 1,
    position: 1,
    saveInMp: true,
  },
  {
    name: "Plan Estándar",
    description: "Plan para usuarios que necesitan más funcionalidades",
    totalPrice: 150,
    durationType: "días",
    duration: 1, // Duración total del ciclo de pago en meses
    features: [
      "Acceso completo",
      "Soporte Estándar",
      "Actualizaciones semanales",
    ],
    isActive: true,
    accessLevel: "Estándar",
    installments: 1,
    position: 2,
    saveInMp: true,
  },
  {
    name: "Plan Premium",
    description:
      "Plan para usuarios avanzados que requieren soporte prioritario",
    totalPrice: 240,
    durationType: "días",
    duration: 3, // Duración total del ciclo de pago en meses
    features: [
      "Acceso completo",
      "Soporte Premium",
      "Actualizaciones diarias",
      "Acceso anticipado a nuevas funciones",
    ],
    isActive: true,
    accessLevel: "Premium",
    installments: 3,
    installmentPrice: 80,
    position: 3,
    saveInMp: true,
  },
  {
    name: "Este plan se guarda En mercado pago con estado analitico",
    description: "Plan para usuarios que necesitan más funcionalidades",
    totalPrice: 10000,
    durationType: "días",
    duration: 1, // Duración total del ciclo de pago en meses
    features: [
      "Acceso completo",
      "Soporte Estándar",
      "Actualizaciones semanales",
    ],
    isActive: false,
    accessLevel: "Estándar",
    installments: 1,
    saveInMp: false,
  },
]; */

// Datos para los descuentos de los planes
/* const descuentos = [
  {
    description: "Descuento especial por pascuas",
    value: 70,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-04-30"),
    isActive: true, 
    event: "Pascuas 2025", 
    planId: 3, 
  },
]; */

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
    description:
      "Categoría relacionada con tecnología blockchain y criptomonedas.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/7339/7339066.png", // Icono de blockchain
  },
  {
    name: "Internet de las Cosas",
    description:
      "Categoría relacionada con dispositivos conectados y automatización.",
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
    description:
      "Categoría relacionada con tecnologías y frameworks para desarrollo web.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/732/732212.png", // Icono de desarrollo web
  },
  {
    name: "Cloud Computing",
    description:
      "Categoría relacionada con servicios en la nube y almacenamiento remoto.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/5333/5333816.png", // Icono de cloud computing
  },
  {
    name: "Big Data",
    description:
      "Categoría relacionada con análisis y gestión de grandes volúmenes de datos.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/2300/2300443.png", // Icono de big data
  },
  {
    name: "Robótica",
    description:
      "Categoría relacionada con robots y automatización industrial.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/1633/1633641.png", // Icono de robótica
  },
  {
    name: "Realidad Virtual",
    description: "Categoría relacionada con VR y experiencias inmersivas.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/3688/3688146.png", // Icono de VR
  },
  {
    name: "5G",
    description:
      "Categoría relacionada con redes móviles de quinta generación.",
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
    description:
      "Carrera enfocada en el análisis y gestión de grandes volúmenes de datos.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/4149/4149643.png", // Icono de data science
  },
  {
    name: "Ingeniería en Ciberseguridad",
    description:
      "Carrera dedicada a la protección de sistemas y datos contra amenazas digitales.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png", // Icono de ciberseguridad
  },
  {
    name: "Ingeniería en Robótica",
    description:
      "Carrera que combina mecánica, electrónica y software para crear robots.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/1260/1260092.png", // Icono de robótica
  },
  {
    name: "Ingeniería en Cloud Computing",
    description:
      "Carrera especializada en servicios en la nube y arquitecturas distribuidas.",
    isActive: true,
    icon: "https://cdn-icons-png.flaticon.com/512/4144/4144438.png", // Icono de cloud computing
  },
  {
    name: "Ingeniería en Desarrollo de Videojuegos",
    description:
      "Carrera enfocada en la creación de videojuegos y experiencias interactivas.",
    isActive: false,
    icon: "https://cdn-icons-png.flaticon.com/512/599/599502.png", // Icono de videojuegos
  },
];

// Datos de ejemplo para secciones con encabezado
const seccionesConEncabezado = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Bienvenido a nuestro curso",
    slogan: "Aprende y crece con nosotros",
    about:
      "Esta es una sección introductoria que describe el curso y su contenido.",
    buttonName: "Ver curso",
    buttonLink: "http://cursoejemplo.com",
    adminId: 1,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Descubre las herramientas de Illustrator",
    slogan: "Crea diseños increíbles con Adobe Illustrator",
    about:
      "En esta sección aprenderás a utilizar las herramientas básicas de Illustrator para crear ilustraciones y diseños profesionales.",
    buttonName: "Ver lección",
    buttonLink: "http://leccionejemplo.com",
    adminId: 1,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Gestiona tus finanzas personales",
    slogan: "Controla tus gastos y ahorra dinero",
    about:
      "En este módulo aprenderás a crear un presupuesto personal, gestionar tus gastos y ahorrar para el futuro.",
    buttonName: "Ver módulo",
    buttonLink: "http://moduloejemplo.com",
    adminId: 1,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Aprende inglés desde cero",
    slogan: "Mejora tus habilidades lingüísticas",
    about:
      "En este módulo introductorio aprenderás vocabulario básico, frases comunes y expresiones en inglés.",
    buttonName: "Ver módulo",
    buttonLink: "http://moduloejemplo.com",
    adminId: 1,
  },
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

    for (const headerSection of seccionesConEncabezado) {
      await HeaderSection.create(headerSection);
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
