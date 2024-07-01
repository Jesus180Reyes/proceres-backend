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
        user_id: req.user.id,
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
  getTotalProducts = async (req: Request, res: Response) => {
    const totalProducts = await InventarioModel().count();
    const totalQuantityProducts = await InventarioModel().sum('cantidad');
    const totalCategories = await CategoriaModel().count();
    const totalProductsOnCocina = await getTotalProductsByCategory(1);
    const totalProductsOnCafe = await getTotalProductsByCategory(2);
    const totalProductsOnRestaurante = await getTotalProductsByCategory(3);
    const totalProductsOnLimpieza = await getTotalProductsByCategory(4);
    const totalProductsOnAirbnb = await getTotalProductsByCategory(5);
    const totalProductsOnInmobiliaria = await getTotalProductsByCategory(6);
    const totalProductsOnPlateria = await getTotalProductsByCategory(7);
    const totalProductsOnUtensillos = await getTotalProductsByCategory(8);
    res.json({
      ok: true,
      totalProducts,
      totalQuantityProducts,
      category: {
        totalCategories,
        totalProductsOnCocina,
        totalProductsOnCafe,
        totalProductsOnRestaurante,
        totalProductsOnLimpieza,
        totalProductsOnAirbnb,
        totalProductsOnInmobiliaria,
        totalProductsOnPlateria,
        totalProductsOnUtensillos,
      },
    });
    async function getTotalProductsByCategory(id: number) {
      const productsOnCategory = await InventarioModel().sum('cantidad', {
        where: {
          categoria_id: id,
        },
      });
      return productsOnCategory;
    }
  };
}
