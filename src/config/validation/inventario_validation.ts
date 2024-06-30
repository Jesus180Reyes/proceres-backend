import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields';
import { AuthMiddleware } from '../../middlewares/auth';
const authMiddleware = new AuthMiddleware();
export const inventarioValidation = [
  authMiddleware.auth,
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
  validateFields,
];
