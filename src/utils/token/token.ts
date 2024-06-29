import { IUsuario } from "../../models/usuario_model";
import jwt from 'jsonwebtoken';
export class Token {
    public generate(user: IUsuario, expireMinutes?: number, expire: number = 30) {
      return new Promise((resolve, reject) => {
        try {
          const privateKey: any = process.env.SECRET_KEY_JWT_API;
          let token = jwt.sign(
            {
              id: user.id,
              nombre: user.nombre,
            },
            privateKey,
            {
              algorithm: 'HS256',
              expiresIn: !expireMinutes ? 3600 * 24 * expire : expireMinutes * 60,
            }
          );
          resolve(token);
        } catch (error) {
          reject('Error generando el  token ' + error);
        }
      });
    }
  }
  