import { InventarioModel } from '../../models/inventario_model';
import { Request, Response } from 'express';
import { MovimientoModel } from '../../models/movimiento_model';
import { CategoriaModel } from '../../models/categoria_model';
import { UsuarioModel } from '../../models/usuario_model';
export class Controller {
  createInventario = async (req: any, res: Response) => {
    const { body } = req;
    try {
      const inventario = await InventarioModel().create({
        ...body,
        user_id: req.user.id
      });
      await MovimientoModel().create({
        title: 'Nuevo Producto Ingresado',
        description: 'Se ha registrado un nuevo producto al inventario',
        tipo_movimiento: 'entrada',
        user_id: body.user_id,
      });
      res.json({
        ok: true,
        msg: 'Producto Creado Exitosamente!',
        inventario,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error.message}`,
      });
    }
  };
  getInventario = async (req: Request, res: Response) => {
    const inventario = await InventarioModel(['categoria', 'user']).findAll({
      include: [
        {
          model: CategoriaModel(),
          as: 'categoria',
          attributes: ['nombre', 'color'],
        },
        {
          model: UsuarioModel(),
          as: 'usuario',
          attributes: ['nombre', 'email'],
        },
      ],
    });
    res.json({
      ok: true,
      inventario,
    });
  };
  getProductoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventario = await InventarioModel().findOne({
      where: {
        id: id,
      },
    });
    res.json({
      ok: true,
      inventario,
    });
  };
}
