import { Router } from 'express';
import { inventarioValidation } from '../../config/validation/inventario_validation';
import { Controller } from '../../controllers/inventario/inventario.controller';

const router = Router();
const controller = new Controller();

router.post('/', inventarioValidation, controller.createInventario);
router.get('/', controller.getInventario);
router.get('/:id', controller.getProductoById);

export default router;
