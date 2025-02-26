import sequelize from "./infrastructure/database/db";

import Role from "./modules/role/Role";
import { rolesIniciales } from "./modules/role/Role";
import Permission from "./modules/role/Permission";
import RolePermission from "./modules/role/RolePermission";
import User from "./modules/user/User";
import Admin from "./modules/admin/Admin";
import SectionHeader from "./modules/headerSection/HeaderSection";
import Recourse from "./modules/resource/Resource";
import Rating from "./modules/resource/rating/Rating";
import Comment from "./modules/resource/comment/Comment";
import RoadMap from "./modules/roadmap/RoadMap";

/* Modelos relacionados con el area de cursos */
import Category from "./modules/category/Category";
import CareerType from "./modules/careerType/CareerType";
import Course from "./modules/course/Course";
import { CourseCategory } from "./modules/course/Course";
import Section from "./modules/section/Section";
import Content from "./modules/content/Content";

/* Modelos relacionas con la pasarela de pagos membresia/suscripcion */
import Discount from "./modules/Membership/models/Discount";
import Invoice from "./modules/Membership/models/Invoice";
import Membership from "./modules/Membership/models/Membership";
import Payment from "./modules/Membership/models/Payment";
import PaymentGateway from "./modules/Membership/models/PaymentGateway";
import PaymentMethod from "./modules/Membership/models/PaymentMethod";
import Plan from "./modules/Membership/models/Plan";
import Refund from "./modules/Membership/models/Refund";
import Transaction from "./modules/Membership/models/Transaction";

// sync.ts
async function syncDatabase() {
  try {
    await sequelize.authenticate();

    // Orden CORREGIDO
    await Permission.sync({ force: true });
    await Role.sync({ force: true });
    await RolePermission.sync({ force: true }); // ¡Primero debe existir esta tabla!

    // Poblar datos DESPUÉS de crear todas las tablas
    await seedInitialData();

    await User.sync({ force: true });

    await Admin.sync({ force: true });

    await SectionHeader.sync({ force: true });

    await Recourse.sync({ force: true });

    await Rating.sync({ force: true });

    await Comment.sync({ force: true });
    await Recourse.sync({ force: true });

    await RoadMap.sync({ force: true });
    /* Area de cursos */
    await Category.sync({ force: true });
    await CareerType.sync({ force: true });
    await Course.sync({ force: true });
    await CourseCategory.sync({ force: true });
    await Section.sync({ force: true });
    await Content.sync({ force: true });

    /* Sincronización de modelos en el orden correcto */
    await Plan.sync({ force: true });
    await Membership.sync({ force: true }); 
    await PaymentGateway.sync({ force: true });
    await PaymentMethod.sync({ force: true });
    await Payment.sync({ force: true });
    await Transaction.sync({ force: true });
    await Invoice.sync({ force: true });
    await Discount.sync({ force: true });
    await Refund.sync({ force: true });

    console.log("¡Sincronización exitosa!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

async function seedInitialData() {
  for (const roleData of rolesIniciales) {
    const [role] = await Role.findOrCreate({
      where: { name: roleData.name },
      defaults: {
        name: roleData.name,
        description: roleData.description,
      },
    });

    const permissions = await Permission.findAll({
      where: { name: roleData.permissions },
    });

    // Modificar esta parte
    if (permissions.length > 0) {
      await Promise.all(
        permissions.map(async (permission) => {
          await role.addPermission(permission);
        })
      );
    }
  }
}

syncDatabase();
