import { Router, Request, Response } from "express";
import { Controller } from "../../controllers/insumos/insumo.controller";


const router = Router();
const controller = new Controller();

router.get('/', controller.getInsumos)


export default router;

