import { CategoriaModel } from '../../models/categoria_model';
import { Request, Response } from 'express';
export class Controller {
  getCategorias = async (req: Request, res: Response) => {
    const categorias = await CategoriaModel().findAll({
      attributes: ['id', 'nombre', 'color'],
    });

    res.json({
      ok: true,
      categorias,
    });
  };
}
