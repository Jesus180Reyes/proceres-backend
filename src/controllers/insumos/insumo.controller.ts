import { Request, Response } from 'express';
import { InsumoModel } from '../../models/insumo_model';
import { UsuarioModel } from '../../models/usuario_model';
import { MovimientoModel } from '../../models/movimiento_model';

export class Controller {
  getInsumos = async (req: Request, res: Response) => {
    const insumos = await InsumoModel(['user']).findAll({
      include: [
        {
          model: UsuarioModel(),
          as: 'user',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });
    res.json({
      ok: true,
      insumos,
    });
  };

  createInsumo = async (req: any, res: Response) => {
    try {
      const { body } = req;
      const insumo = await InsumoModel().create({
        nombre_producto: body.nombre_producto,
        cantidad: body.cantidad,
        observacion_general: body.observacion_general,
        user_id: req.user.id,
      });
      await MovimientoModel().create({
        title: 'Insumo Creado en Inventario',
        description: 'Se ha creado un Insumo al Inventario',
        tipo_movimiento: 'entrada',
        user_id: req.user.id
      })
      res.json({
        ok: true,
        insumo,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error}`,
      });
    }
  };
  totalInsumo = async (req:Request, res: Response) => {
    const totalInsumos = await InsumoModel().count();
    const quantityInsumos = await InsumoModel().sum('cantidad');

    res.json({
      ok: true,
      totalInsumos,
      quantityInsumos
    })
  }
}
