import { Router } from 'express';
import { inventarioValidation } from '../../config/validation/inventario_validation';
import { Controller } from '../../controllers/categorias/categorias.controller';
import { AuthMiddleware } from '../../middlewares/auth';

const router = Router();
const controller = new Controller();
const auth = new AuthMiddleware();
router.get('/', [auth.auth],controller.getCategorias);

export default router;
