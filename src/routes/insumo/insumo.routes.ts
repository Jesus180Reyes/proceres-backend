import { Router } from 'express';
import { Controller } from '../../controllers/insumos/insumo.controller';
import { insumoValidation } from '../../config/validation/insumoValidation';
import { AuthMiddleware } from '../../middlewares/auth';

const router = Router();
const controller = new Controller();
const auth = new AuthMiddleware();

router.get('/', [auth.auth], controller.getInsumos);

router.post('/', insumoValidation, controller.createInsumo);
router.get('/total/insumo', [auth.auth], controller.totalInsumo);
router.post('/pdf', [auth.auth], controller.createPDF);

export default router;
