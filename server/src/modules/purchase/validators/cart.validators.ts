import { body, param } from "express-validator";
import { EncryptionUtils } from "../../../shared/utils/encryption.utils";

export const addCourseToCartValidation = [
  body("courseId")
    .custom((value) => {
      // Verificar si es un número entero positivo
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        return true;
      }
      // Verificar si es un ID encriptado válido
      if (typeof value === 'string' && EncryptionUtils.isValidEncryptedId(value)) {
        return true;
      }
      throw new Error("El ID del curso debe ser un número entero positivo o un ID encriptado válido");
    }),
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
