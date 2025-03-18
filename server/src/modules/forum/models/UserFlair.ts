import { DataTypes, Model, Optional, Op } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumFlair from "./ForumFlair";

/**
 * @interface UserFlairAttributes
 * @description Define los atributos del modelo UserFlair
 */
interface UserFlairAttributes {
  id: number;
  userId: number;
  flairId: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface UserFlairCreationAttributes
 * @description Define los atributos opcionales durante la creación de un UserFlair
 */
interface UserFlairCreationAttributes extends Optional<UserFlairAttributes, "id" | "isActive"> {}

/**
 * @class UserFlair
 * @description Modelo para gestionar la relación muchos a muchos entre usuarios y flairs
 * @extends Model<UserFlairAttributes, UserFlairCreationAttributes>
 */
class UserFlair extends Model<UserFlairAttributes, UserFlairCreationAttributes> implements UserFlairAttributes {
  public id!: number;
  public userId!: number;
  public flairId!: number;
  public isActive!: boolean;
  public expiresAt?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Obtiene los flairs asignados a un usuario específico
   * @param userId ID del usuario
   * @param options Opciones adicionales (onlyActive: mostrar solo flairs activos)
   * @returns Promise<UserFlair[]> Lista de asignaciones de flairs
   */
  static getUserFlairs = async function(userId: number, options = { onlyActive: true }) {
    const whereClause: any = { userId };
    
    if (options.onlyActive) {
      whereClause.isActive = true;
    }
    
    return await UserFlair.findAll({
      where: whereClause,
      include: [
        {
          model: ForumFlair,
          as: 'flair',
          attributes: ['id', 'name', 'description', 'icon', 'type', 'color']
        }
      ]
    });
  };

  /**
   * Verifica si un usuario tiene un flair específico asignado
   * @param userId ID del usuario
   * @param flairId ID del flair a verificar
   * @returns Promise<boolean> True si el usuario tiene el flair, false en caso contrario
   */
  static async hasFlair(userId: number, flairId: number): Promise<boolean> {
    const count = await UserFlair.count({
      where: {
        userId,
        flairId,
        isActive: true
      }
    });
    return count > 0;
  }

  /**
   * Asigna un flair a un usuario
   * @param userId ID del usuario
   * @param flairId ID del flair
   * @param expiresAt Fecha de expiración (opcional)
   * @returns Promise<UserFlair> La asignación creada o actualizada
   */
  static async assignFlair(userId: number, flairId: number, expiresAt?: Date): Promise<UserFlair> {
    const transaction = await sequelize.transaction();
    
    try {
      // Verificar si ya existe
      const existingAssignment = await UserFlair.findOne({
        where: {
          userId,
          flairId
        }
      });
      
      // Si existe pero está inactivo, lo reactivamos
      if (existingAssignment) {
        if (!existingAssignment.isActive) {
          existingAssignment.isActive = true;
          if (expiresAt) {
            existingAssignment.expiresAt = expiresAt;
          }
          await existingAssignment.save({ transaction });
        }
        await transaction.commit();
        return existingAssignment;
      }
      
      // Si no existe, creamos uno nuevo
      const newAssignment = await UserFlair.create({
        userId,
        flairId,
        expiresAt,
        isActive: true
      }, { transaction });
      
      await transaction.commit();
      return newAssignment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Desactiva un flair asignado a un usuario
   * @param userId ID del usuario
   * @param flairId ID del flair
   * @returns Promise<boolean> True si se desactivó correctamente, false si no existía
   */
  static async removeFlair(userId: number, flairId: number): Promise<boolean> {
    const transaction = await sequelize.transaction();
    
    try {
      const existingAssignment = await UserFlair.findOne({
        where: {
          userId,
          flairId,
          isActive: true
        }
      });
      
      if (!existingAssignment) {
        await transaction.commit();
        return false;
      }
      
      existingAssignment.isActive = false;
      await existingAssignment.save({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene los usuarios que tienen asignado un flair específico
   * @param flairId ID del flair
   * @param onlyActive Si es true, solo muestra asignaciones activas
   * @returns Promise<User[]> Lista de usuarios con el flair asignado
   */
  static async getUsersWithFlair(flairId: number, onlyActive = true): Promise<User[]> {
    const whereClause: any = { flairId };
    
    if (onlyActive) {
      whereClause.isActive = true;
    }
    
    const userFlairs = await UserFlair.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'avatar', 'role']
        }
      ]
    });
    
    return userFlairs.map(uf => uf.get('user') as User);
  }
}

UserFlair.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "Identificador único de la asignación usuario-flair"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      comment: "ID del usuario al que se asigna el distintivo"
    },
    flairId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumFlairs",
        key: "id"
      },
      onDelete: "CASCADE",
      comment: "ID del distintivo asignado al usuario"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Indica si la asignación está activa"
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de expiración del distintivo (null si no expira)"
    }
  },
  {
    sequelize,
    modelName: "UserFlair",
    tableName: "UserFlairs",
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "flairId"],
        unique: true,
        name: "idx_user_flair_unique"
      },
      {
        fields: ["userId"],
        name: "idx_user_flair_user"
      },
      {
        fields: ["flairId"],
        name: "idx_user_flair_flair"
      },
      {
        fields: ["isActive"],
        name: "idx_user_flair_active"
      }
    ],
    comment: "Almacena las asignaciones de distintivos a usuarios"
  }
);

// Hooks
UserFlair.addHook('afterCreate', async (userFlair: UserFlair) => {
  try {
    const user = await User.findByPk(userFlair.userId);
    const flair = await ForumFlair.findByPk(userFlair.flairId);
    if (user && flair) {
      console.log(`Distintivo "${flair.name}" asignado al usuario "${user.get('username')}" con éxito.`);
    }
  } catch (error) {
    console.error('Error en hook afterCreate de UserFlair:', error);
  }
});

// Hook para verificar y manejar flairs expirados
UserFlair.addHook('beforeFind', (options: any) => {
  const currentDate = new Date();
  
  // Si se incluye la condición where, extenderla; si no, crearla
  if (!options.where) {
    options.where = {};
  }
  
  // Si no se especifica manejar expirados, agregar condición para expiración
  if (!options.ignoreExpired) {
    options.where = {
      ...options.where,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: currentDate } }
      ]
    };
  }
  
  return options;
});

export default UserFlair;