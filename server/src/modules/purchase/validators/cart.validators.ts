import { body, param } from "express-validator";

export const addCourseToCartValidation = [
  body("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),
];

export const removeCourseFromCartValidation = [
  param("courseId")
    .isInt({ gt: 0 })
    .withMessage("El ID del curso debe ser un número entero positivo"),
];

export const cartIdValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID del carrito debe ser un número entero positivo"),
];
