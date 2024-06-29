import {NextFunction, Request, Response} from 'express'
import { UsuarioModel } from '../models/usuario_model';
export class UserMiddleware {
    
    isUserExists = async(req: Request, res: Response, next: NextFunction) => {
        const {email} = req.body;
        const user = await UsuarioModel().findOne({
            where: {
                email: email,
            }
        });
        if(user) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario Ya existe con ese Correo'
            })
        }

        next();




    }
}