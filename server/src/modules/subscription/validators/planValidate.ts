import { body, validationResult } from "express-validator";
import Plan from "../models/Plan";

// Validador para crear o actualizar un Plan
export const validatePlan = [
  body("name")
    .notEmpty().withMessage("El nombre no puede estar vacío")
    .bail()
    .isString().withMessage("El nombre debe ser una cadena de texto")
    .bail()
    .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 100 caracteres"),
  
  body("description")
    .notEmpty().withMessage("La descripción no puede estar vacía")
    .bail()
    .isString().withMessage("La descripción debe ser una cadena de texto"),
  
  body("totalPrice")
    .isFloat({ min: 0 }).withMessage("El precio total debe ser un número decimal mayor o igual a 0"),
  
  body("duration")
    .isInt({ min: 1 }).withMessage("La duración debe ser un número entero mayor o igual a 1"),
  
  body("durationType")
    .isIn(["días", "meses"]).withMessage('La unidad de duración debe ser "días" o "meses"'),
  
  body("features")
    .isArray().withMessage("Las características deben ser un arreglo")
    .bail()
    .notEmpty().withMessage("Las características no pueden estar vacías"),
  
  body("accessLevel")
    .isIn(["Básico", "Estándar", "Premium"]).withMessage('El nivel de acceso debe ser "Básico", "Estándar" o "Premium"'),
  
  body("installments")
    .optional()
    .isInt({ min: 1 }).withMessage("Las cuotas deben ser un número entero mayor o igual a 1")
    .bail()
    .custom((value, { req }) => {
      if (req.body.duration) {
        const duration = parseInt(req.body.duration, 10);
        if (duration % value !== 0) {
          throw new Error("La duración debe ser divisible por el número de cuotas");
        }
      }
      return true;
    }),
  
  body("installmentPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("El precio de cada cuota debe ser un número decimal mayor o igual a 0"),
  
  body("isActive")
    .isBoolean().withMessage("El estado activo debe ser un valor booleano")
    .bail()
    .custom(async (value, { req }) => {
      // Solo verificamos límite si está activando un plan
      if (!value) return true;
      
      const planId = req.params?.id;
      // Si es una actualización y el plan ya existe, permitir
      if (planId) {
        const plan = await Plan.findByPk(planId);
        if (plan) return true;
      }

      // Verificar límite de planes activos
      const count = await Plan.count({ where: { isActive: true } });
      if (count >= 3) {
        throw new Error("Solo pueden haber tres planes activos.");
      }
      return true;
    }),
  
  body("position")
    .optional()
    .isInt().withMessage("El campo position debe ser un número entero")
    .bail()
    .custom(async (value, { req }) => {
      const planId = req.params?.id;
      const existingPlan = await Plan.findOne({ where: { position: value } });
      
      // Si existe un plan con esa posición y no es el plan actual que estamos actualizando
      if (existingPlan && existingPlan.id !== planId) {
        throw new Error("El valor de la posición debe ser único.");
      }
      return true;
    }),
];
