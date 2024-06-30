import {Request, Response} from 'express';
import { InsumoModel } from "../../models/insumo_model";
import { UsuarioModel } from '../../models/usuario_model';

export class Controller {
    

    getInsumos = async(req: Request, res: Response) => {

        const insumos = await InsumoModel(['user']).findAll({
            include: [
                {
                    model: UsuarioModel(),
                    as: 'user',
                    attributes: {
                        exclude: ['password','createdAt', 'updatedAt'],
                    }
                }
            ]
        });
        res.json({
            ok: true, 
            insumos,
        });
    }
}