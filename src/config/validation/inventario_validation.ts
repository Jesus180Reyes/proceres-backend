import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields';

export const inventarioValidation = [
  check('nombre_producto')
    .notEmpty()
    .exists()
    .withMessage('Nombre de Producto es Requerido'),
  check('cantidad').notEmpty().exists().withMessage('Cantidad es Requerido'),
  check('categoria_id')
    .notEmpty()
    .exists()
    .withMessage('Categoria es Requerido'),
  check('categoria_id').isInt().not().withMessage('Categoria debe ir como Int'),
  check('user_id').notEmpty().exists().withMessage('Usuario es Requerido'),
  check('user_id').isInt().not().withMessage('Usuario debe ir como Int'),
  validateFields,
];
