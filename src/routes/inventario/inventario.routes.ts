import { Router } from 'express';
import { inventarioValidation } from '../../config/validation/inventario_validation';
import { Controller } from '../../controllers/inventario/inventario.controller';
import { AuthMiddleware } from '../../middlewares/auth';

const router = Router();
const controller = new Controller();
const auth = new AuthMiddleware();
router.post(
  '/',
  [auth.auth],
  inventarioValidation,
  controller.createInventario
);
router.get('/', [auth.auth], controller.getInventario);
router.get('/:id', [auth.auth], controller.getProductoById);
router.get('/total/Products', [auth.auth], controller.getTotalProducts);
router.post('/pdf', [auth.auth], controller.createPDF);

export default router;
