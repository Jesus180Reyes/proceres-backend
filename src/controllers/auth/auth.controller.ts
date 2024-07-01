import { Request, Response } from 'express';
import { UsuarioModel } from '../../models/usuario_model';
import bycrypt from 'bcrypt';
import { Token } from '../../utils/token/token';
export class Controller {
  login = async (req: Request, res: Response) => {
    const { password, email } = req.body;
    try {
      const user = await UsuarioModel().findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(401).json({
          ok: false,
          msg: 'Usuario con ese correo no existe',
        });
      }
      const isValidPassword = bycrypt.compareSync(
        password,
        user?.dataValues.password ?? ''
      );
      if (!isValidPassword) {
        return res.status(401).json({
          ok: false,
          msg: 'Usuario o contrasena Incorrectos',
        });
      }
      user.dataValues.password = undefined;
      const tokenClass = new Token();
      const token = await tokenClass.generate(user.dataValues);

      res.json({
        ok: true,
        msg: 'Usuario Logueado exitosamente!!',
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error}`,
      });
    }
  };
  registerUser = async (req: Request, res: Response) => {
    const { body } = req;
    try {
      const salt = bycrypt.genSaltSync(10);
      const hashPassword = bycrypt.hashSync(body.password, salt);
      const user = await UsuarioModel().create({
        email: body.email,
        nombre: body.nombre,
        password: hashPassword,
      });
      const token = await new Token().generate(user.dataValues);

      res.json({
        ok: true,
        msg: 'Usuario Registrado exitosamente',
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error}`,
      });
    }
  };
}
