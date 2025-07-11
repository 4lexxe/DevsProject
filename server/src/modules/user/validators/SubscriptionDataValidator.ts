import { body } from 'express-validator';
import User from '../User'; 

const userValidations = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 , max: 200}).withMessage('El nombre debe tener al menos 2 caracteres')
        .isString().withMessage('Nombre inválido'),
    body('surname')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2, max: 200 }).withMessage('El apellido debe tener al menos 2 caracteres')
        .isString().withMessage('Apellido inválido'),
    body('phone')
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ min: 10, max: 15 }).withMessage('El teléfono debe tener entre 10 y 15 caracteres')
        .matches(/^(\+54\s?)?(\d{10})$/).withMessage('Teléfono argentino inválido'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .custom(async (value, { req }) => {
            if (!value) return true;
            const user = await User.findOne({ where: { email: value } });
            // Permite si no existe o si el id coincide (edición)
            if (user && user.id !== req.body.id) {
                throw new Error('El email ya está registrado por otro usuario');
            }
            return true;
        }),
    body('identificationNumber')
        .notEmpty().withMessage('El número de identificación es obligatorio')
        .isString().withMessage('Número de identificación inválido'),
    body('identificationType')
        .notEmpty().withMessage('El tipo de identificación es obligatorio')
        .isString().withMessage('Tipo de identificación inválido')
        .custom((value) => {
            const allowedTypes = ['dni', 'cuil', 'cuit'];
            if (value && !allowedTypes.includes(value)) {
                throw new Error('Tipo de identificación debe ser uno de: dni, cuil, cuit');
            }
            return true;
        }),
];

export default userValidations;