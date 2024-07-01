import { Router } from "express";
import { Controller } from "../../controllers/insumos/insumo.controller";
import { insumoValidation } from "../../config/validation/insumoValidation";


const router = Router();
const controller = new Controller();

router.get('/', controller.getInsumos);

router.post('/',insumoValidation, controller.createInsumo);


export default router;

