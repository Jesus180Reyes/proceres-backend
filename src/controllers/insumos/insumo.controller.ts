import {Request, Response} from 'express';
import { InsumoModel } from "../../models/insumo_model";

export class Controller {
    

    getInsumos = async(req: Request, res: Response) => {

        const insumos = await InsumoModel().findAll();
        res.json({
            ok: true, 
            insumos,
        });
    }
}