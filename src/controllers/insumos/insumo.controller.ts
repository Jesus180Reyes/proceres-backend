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

    createInsumo = async(req:any, res: Response) => {
        try {
        const {body} = req
        const insumo = await InsumoModel().create({
            nombre_producto: body.nombre_producto,
            cantidad: body.cantidad,
            observacion_general: body.observacion_general,
            user_id: req.user.id
        });
        res.json({
            ok: true,
            insumo,
        });
        } catch (error) {
        console.log(error);
        return res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error}`
        });
        }

    }
}