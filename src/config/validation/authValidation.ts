import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields';
export const authValidation = [
  check('email')
    .notEmpty()
    .exists()
    .withMessage('Email es obligatorio'),
    check('email').isEmail().not().withMessage('Email no valido'),
  check('password').notEmpty().exists().withMessage('Password es obligatorio'),
  check("password", "La Contrasena debe ser mayor a 6 caracteres").isLength({min: 6}),
  validateFields,
];
