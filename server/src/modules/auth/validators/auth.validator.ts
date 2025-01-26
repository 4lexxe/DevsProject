import { body } from "express-validator";

export const registerValidations = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula"),
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("username").trim().notEmpty().withMessage("El username es requerido"),
  body("roleId").optional().isInt().withMessage("El roleId debe ser un número entero"),
];

export const loginValidations = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];