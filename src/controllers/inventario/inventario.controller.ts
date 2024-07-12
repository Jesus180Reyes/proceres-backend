import { InventarioModel } from '../../models/inventario_model';
import { Request, Response } from 'express';
import { MovimientoModel } from '../../models/movimiento_model';
import { CategoriaModel } from '../../models/categoria_model';
import { UsuarioModel } from '../../models/usuario_model';
import { Op } from 'sequelize';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import { SendMail } from '../../utils/mail/sendMail';
import { Base64 } from 'js-base64';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    const { categoria, user, startDate, endDate } = req.query;
    const whereClause: any = {};
    if (categoria) {
      whereClause['categoria_id'] = Number(categoria);
    }
    if (user) {
      whereClause['user_id'] = Number(user);
    }
    if (startDate && endDate) {
      const start = moment(new Date(startDate as any).toISOString().slice(0, -1)).format(
        'YYYY-MM-DD 00:00:00'
      );
      const end = moment(new Date(endDate as any).toISOString().slice(0, -1)).format(
        'YYYY-MM-DD 23:59:59'
      );
      whereClause['createdAt'] = {
        [Op.between]: [start, end],
      };
    }

    const inventario = await InventarioModel(['categoria', 'user']).findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
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

  createPDF = async(req: any, res: Response) => {
    const {id} = req.user
    const {startDate,endDate, user, categoria} = req.body;
    const whereClause: any = {};
    if (categoria) {
      whereClause['categoria_id'] = Number(categoria);
    }
    if (user) {
      whereClause['user_id'] = Number(user);
    }
    if (startDate && endDate) {
      const start = moment(new Date(startDate).toISOString().slice(0, -1)).format(
        'YYYY-MM-DD 00:00:00'
      );
      const end = moment(new Date(endDate).toISOString().slice(0, -1)).format(
        'YYYY-MM-DD 23:59:59'
      );
      whereClause['createdAt'] = {
        [Op.between]: [start, end],
      };
    }
    const currentUser = await UsuarioModel().findByPk(Number(id));
    const inventario  = await InventarioModel(['categoria', 'user']).findAll({
      where: whereClause,
      include: [
        {
          model: CategoriaModel(),
          as: 'categoria'
        },
        {
          model: UsuarioModel(),
          as: 'usuario'
        }
      ]
    });
    const options = {
      to: currentUser?.dataValues.email,
      email: currentUser?.dataValues.email,
      name: currentUser?.dataValues.nombre,
      filename: 'Reporte.pdf',
    };
    const header = {
      columns: await createPDFHeader('Reporte de Inventario'),
      columnGap: 10,
      margin: [0, 0, 0, 30],
    };

      const dataTable = {
        margin: [30, 30, 30, 30],
        columnGap: 10,
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          fillColor: '#01595C',
          layout: {
            defaultBorder: false,
          },
  
          body: await createFacturaSection(inventario),
        },
    }
    const pdf: any = {
      content: [header, dataTable.table.body ? dataTable : undefined ],
      footer: createFooter
    };
    pdfMake.createPdf(pdf).getBuffer(async (data) => {
      const sendMail = new SendMail('inventario');

      await sendMail.send(options, 'Reporte de Inventario', data);
    });

    res.json({
      ok: true,
      msg: 'PDF Creado Exitosamente',
    })

    async function createPDFHeader(checkName: string) {
      // const result: any = await this.getImageBase64(logo);
      const currentDate = moment().format('DD-MM-YYYY');
      const header = [
        // {
        //   image: `data:image/png;base64,${result}`,
        //   // image: result,
        //   width: 68
        // },
        {
          width: '65%',
          margin: [15, 20, 0, 0],
          fontSize: 15,
          color: '#01595C',
          text: checkName,
        },
        {
          width: '10%',
          bold: true,
          color: '#657685',
          margin: [0, 20, 0, 0],
          text: 'Fecha:',
        },
        {
          width: '20%',
          color: '#657685',
          margin: [-5, 20, 0, 0],
          text: currentDate,
        },
      ];
      return header;
    }
  
    async function createFacturaSection(signos: any[]) {
      // const project: any = await this.getNameProject(checkData.project);
      const data: any = [];
      const border = [true, true, true, true];
      const borderTitle = ['#01595C', '#01595C', '#FFFFFF', '#01595C'];
      const borderText = ['#01595C', '#01595C', '#01595C', '#01595C'];
      if(signos.length === 0) return;
      signos.forEach((e) => {
        data.push([
          {
            colSpan: 2,
            text: '',
            fillColor: '#FFFFFF',
            color: '#FFFFFF',
            fontSize: 12,
            margin: [0, 15], // Agregar margen superior e inferior a la descripción
            opacity: 0,
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], // Hacer transparentes los bordes izquierdo y derecho
          },
          {
            text: '',
            fillColor: '#FFFFFF',
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], // Hacer transparentes los bordes izquierdo y derecho
            margin: [0, 15], // Agregar margen superior e inferior a la descripción
            opacity: 0,
            // borderColor: 'rgba(0, 0, 0, 0)'
          },
        ]);
        data.push([
          {
            colSpan: 2,
            text: 'Producto',
            fillColor: '#01595C',
            color: '#FFFFFF',
            fontSize: 12,
          },
          {
            text: '',
            fillColor: '#01595C',
          },
        ]);
  
        data.push([
          {
            text: 'Nombre de Producto:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.nombre_producto,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
  
        data.push([
          {
            text: 'Cantidad:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.cantidad,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
        data.push([
          {
            text: 'Categoria:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.categoria.nombre ?? 'N/A',
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
        data.push([
          {
            text: 'Creado por:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.usuario.nombre,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
        data.push([
          {
            text: 'Observacion General:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e.observacion_general.length === 0 ? 'N/A' : e.observacion_general ,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
        data.push([
          {
            text: 'Fecha de creacion:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: moment(e.createdAt).format('DD/MM/YYYY'),
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
      });
  
      return data;
    }
   function createFooter(currentPage: number, pageCount: number) {
      return {
        columns: [
          // { text: '', alignment: 'center' }, // Espacio vacío a la izquierda
          {
            text: `${currentPage}/${pageCount}`,
            alignment: 'center',
            style: {
              fontSize: 8,
              italics: true,
            },
          },
          // { text: '', alignment: 'center' }  // Espacio vacío a la derecha
        ],
        margin: [0, 0, 0, 0],
      };
    }
    
    

    
  }
  
}
