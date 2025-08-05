import sequelize from "./infrastructure/database/db";

import Role from "./modules/role/Role";
import { rolesIniciales } from "./modules/role/Role";
import Permission from "./modules/role/Permission";
import RolePermission from "./modules/role/RolePermission";
import User from "./modules/user/User";
import Admin from "./modules/admin/Admin";
import Session from "./modules/auth/models/Session";
import SectionHeader from "./modules/headerSection/HeaderSection";
import Recourse from "./modules/resource/Resource";
import Rating from "./modules/resource/rating/Rating";
import Comment from "./modules/resource/comment/Comment";
import RoadMap from "./modules/roadmap/RoadMap";

/* Modelos relacionados con el area de cursos */
import Category from "./modules/course/models/Category";
import CareerType from "./modules/course/models/CareerType";
import Course from "./modules/course/models/Course";
import { CourseCategory } from "./modules/course/models/Course";
import Section from "./modules/course/models/Section";
import Content from "./modules/course/models/Content";
import Progress from "./modules/course/models/Progress";

/* Modelos relacionas con la pasarela de pagos membresia/suscripcion */
import PlanDiscountEvent from "./modules/subscription/models/PlanDiscountEvent";
import Invoice from "./modules/subscription/models/Invoice";
import Subscription from "./modules/subscription/models/Subscription";
import MPSubscription from "./modules/subscription/models/MPSubscription";
import SubscriptionPayment from "./modules/subscription/models/SubscriptionPayment";
import Plan from "./modules/subscription/models/Plan";

/* Modelos relacionados con las compras de cursos */
import Cart from "./modules/purchase/models/Cart";
import CartCourse from "./modules/purchase/models/CartCourse";
import Preference from "./modules/purchase/models/Preference";
import PreferencePayment from "./modules/purchase/models/PreferencePayment";
import CourseDiscountEvent, { CourseDiscountEventAssociation } from "./modules/purchase/models/CourseDiscountEvent";
import CourseAccess from "./modules/purchase/models/CourseAccess";

import MPWebhookEvent from "./modules/webhook/MPWebhookEvent";
// Importar las asociaciones
import "./modules/purchase/models/Associations";

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
    await Session.sync({ force: true });

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
    await Progress.sync({ force: true });

    // Area de pagos
    await MPWebhookEvent.sync({ force: true });
    await Plan.sync({ force: true });
    await PlanDiscountEvent.sync({ force: true });
    await MPSubscription.sync({ force: true });
    await Subscription.sync({ force: true }); 
    await SubscriptionPayment.sync({ force: true });
    await Invoice.sync({ force: true });

    // Area de compras de cursos
    await CourseDiscountEvent.sync({ force: true });
    await CourseDiscountEventAssociation.sync({ force: true });
    await CourseAccess.sync({ force: true });
    await Preference.sync({ force: true });
    await Cart.sync({ force: true });
    await CartCourse.sync({ force: true });
    await PreferencePayment.sync({ force: true });

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
