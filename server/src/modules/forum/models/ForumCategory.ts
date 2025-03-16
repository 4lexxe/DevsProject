import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";


interface ForumCategoryAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  banner?: string;
  memberCount?: number;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumCategoryCreationAttributes extends Optional<ForumCategoryAttributes, "id" | "memberCount"> {}

class ForumCategory extends Model<ForumCategoryAttributes, ForumCategoryCreationAttributes> implements ForumCategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon?: string;
  public banner?: string;
  public memberCount?: number;
  public slug?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }
}

ForumCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL o ruta a la imagen de icono de la categoría"
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL o ruta a la imagen de banner de la categoría"
    },
    memberCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: "URL amigable para la categoría"
    },
  },
  {
    sequelize,
    modelName: "ForumCategory",
    tableName: "ForumCategories",
    timestamps: true,
    hooks: {
      beforeValidate: (category) => {
        if (!category.slug) {
          category.slug = ForumCategory.generateSlug(category.name);
        }
      }
    },
  }
);

// Datos para el seeder
export const predefinedCategories = [
  {
    name: "JavaScript",
    description: "Discusiones sobre JavaScript, incluidos frameworks y librerías",
    icon: "",
    banner: ""
  },
  {
    name: "TypeScript",
    description: "Todo sobre TypeScript, tipos, interfaces y su ecosistema",
    icon: "",
    banner: ""
  },
  {
    name: "Python",
    description: "Todo sobre Python, desde scripts básicos hasta machine learning",
    icon: "",
    banner: ""
  },
  {
    name: "Java",
    description: "Java, Spring, Android y todo el ecosistema Java",
    icon: "",
    banner: ""
  },
  {
    name: "C#",
    description: "Desarrollo con C#, .NET, Xamarin y más",
    icon: "",
    banner: ""
  },
  {
    name: "PHP",
    description: "PHP, Laravel, Symfony y desarrollo web con PHP",
    icon: "",
    banner: ""
  },
  {
    name: "Ruby",
    description: "Ruby, Rails y el ecosistema Ruby",
    icon: "",
    banner: ""
  },
  {
    name: "SQL",
    description: "SQL, bases de datos relacionales y optimización de consultas",
    icon: "",
    banner: ""
  },
  {
    name: "NoSQL",
    description: "MongoDB, Redis, Cassandra y otras bases de datos NoSQL",
    icon: "",
    banner: ""
  },
  {
    name: "React",
    description: "React, Redux, Next.js y el ecosistema React",
    icon: "",
    banner: ""
  },
  {
    name: "Vue.js",
    description: "Vue.js, Vuex, Nuxt y el ecosistema Vue",
    icon: "",
    banner: ""
  },
  {
    name: "Angular",
    description: "Angular, RxJS, NgRx y el ecosistema Angular",
    icon: "",
    banner: ""
  },
  {
    name: "CSS",
    description: "CSS, Sass, Less, Tailwind y diseño web",
    icon: "",
    banner: ""
  },
  {
    name: "DevOps",
    description: "CI/CD, Docker, Kubernetes y prácticas DevOps",
    icon: "",
    banner: ""
  },
  {
    name: "Cloud",
    description: "AWS, Azure, GCP y computación en la nube",
    icon: "",
    banner: ""
  },
  {
    name: "Móvil",
    description: "Desarrollo móvil con React Native, Flutter, Swift y más",
    icon: "",
    banner: ""
  },
  {
    name: "General",
    description: "Discusiones generales sobre programación y tecnología",
    icon: "",
    banner: ""
  }
];

export default ForumCategory;