import { Router } from 'express';
import { inventarioValidation } from '../../config/validation/inventario_validation';
import { Controller } from '../../controllers/categorias/categorias.controller';

const router = Router();
const controller = new Controller();

router.get('/', controller.getCategorias);

export default router;
