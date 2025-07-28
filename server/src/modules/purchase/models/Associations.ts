import User from "../../user/User";
import Course from "../../course/models/Course";
import Cart from "./Cart";
import CartCourse from "./CartCourse";
import Preference from "./Preference";
import PreferencePayment from "./PreferencePayment";
import CourseDiscountEvent from "./CourseDiscountEvent";
import CourseAccess from "./CourseAccess";

// Establecer todas las relaciones entre los modelos de purchase

// Relaciones de User
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
User.hasMany(CourseAccess, { foreignKey: 'userId', as: 'courseAccess' });

// Relaciones de Course
Course.hasMany(CartCourse, { foreignKey: 'courseId', as: 'cartCourses' });
Course.hasMany(CourseDiscountEvent, { foreignKey: 'courseId', as: 'discountEvents' });
Course.hasMany(CourseAccess, { foreignKey: 'courseId', as: 'courseAccess' });

// Relaciones de Cart
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Preference, { foreignKey: 'preferenceId', as: 'preference' });
Cart.hasMany(CartCourse, { foreignKey: 'cartId', as: 'cartCourses' });
Cart.belongsToMany(Course, { 
  through: CartCourse, 
  foreignKey: 'cartId', 
  otherKey: 'courseId', 
  as: 'courses' 
});

// Relaciones de CartCourse
CartCourse.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartCourse.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Relaciones de Preference
Preference.hasMany(Cart, { foreignKey: 'preferenceId', as: 'carts' });
Preference.hasMany(PreferencePayment, { foreignKey: 'preferenceId', as: 'payments' });

// Relaciones de PreferencePayment
PreferencePayment.belongsTo(Preference, { foreignKey: 'preferenceId', as: 'preference' });

// Relaciones de CourseDiscountEvent
CourseDiscountEvent.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Relaciones de CourseAccess
CourseAccess.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CourseAccess.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Relación many-to-many entre Course y Cart a través de CartCourse
Course.belongsToMany(Cart, { 
  through: CartCourse, 
  foreignKey: 'courseId', 
  otherKey: 'cartId', 
  as: 'carts' 
});

export {
  User,
  Course,
  Cart,
  CartCourse,
  Preference,
  PreferencePayment,
  CourseDiscountEvent,
  CourseAccess
};
