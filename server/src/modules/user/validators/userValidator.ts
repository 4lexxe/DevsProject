import { body } from 'express-validator';
import User from '../User'; 

const userValidations = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('roleId').optional().isInt().withMessage('El roleId debe ser un número entero'),
    body('registrationIp').optional().isIP().withMessage('IP inválida'),
    body('lastLoginIp').optional().isIP().withMessage('IP inválida')
  ];

export default userValidations; 