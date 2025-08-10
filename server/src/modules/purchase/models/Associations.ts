import User from "../../user/User";
import Course from "../../course/models/Course";
import Cart from "./Cart";
import CartCourse from "./CartCourse";
import Order from "./Order";
import OrderCourse from "./OrderCourse";
import PreferencePayment from "./PreferencePayment";
import CourseDiscount from "./CourseDiscount";
import CourseAccess from "./CourseAccess";

// Establecer todas las relaciones entre los modelos de purchase

// Relaciones de User
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
User.hasMany(CourseAccess, { foreignKey: 'userId', as: 'courseAccess' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Relaciones de Course
Course.hasMany(CartCourse, { foreignKey: 'courseId', as: 'cartCourses' });
Course.hasMany(OrderCourse, { foreignKey: 'courseId', as: 'orderCourses' });
Course.hasMany(CourseAccess, { foreignKey: 'courseId', as: 'courseAccess' });

// Relación uno a muchos entre Course y CourseDiscount
Course.belongsTo(CourseDiscount, { 
  foreignKey: 'courseDiscountId', 
  as: 'courseDiscount',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
CourseDiscount.hasMany(Course, { 
  foreignKey: 'courseDiscountId', 
  as: 'courses',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Relaciones de Cart
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartCourse, { foreignKey: 'cartId', as: 'cartCourses' });
Cart.belongsToMany(Course, { 
  through: CartCourse, 
  foreignKey: 'cartId', 
  otherKey: 'courseId', 
  as: 'courses' 
});
// Relación uno a uno entre Cart y Order
Cart.hasOne(Order, { foreignKey: 'cartId', as: 'order' });
Order.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Relaciones de CartCourse
CartCourse.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartCourse.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Relaciones de Order
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderCourse, { foreignKey: 'OrderId', as: 'orderCourses' });
Order.belongsToMany(Course, { 
  through: OrderCourse, 
  foreignKey: 'OrderId', 
  otherKey: 'courseId', 
  as: 'courses' 
});

// Relaciones de OrderCourse
OrderCourse.belongsTo(Order, { foreignKey: 'OrderId', as: 'order' });
OrderCourse.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Relaciones de PreferencePayment
PreferencePayment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(PreferencePayment, { foreignKey: 'orderId', as: 'payments' });

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
  Order,
  OrderCourse,
  PreferencePayment,
  CourseDiscount,
  CourseAccess
};
