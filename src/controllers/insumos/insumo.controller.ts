import { Request, Response } from 'express';
import { InsumoModel } from '../../models/insumo_model';
import { UsuarioModel } from '../../models/usuario_model';
import { MovimientoModel } from '../../models/movimiento_model';
import { Op } from 'sequelize';
import moment from 'moment';
import { SendMail } from '../../utils/mail/sendMail';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class Controller {
  getInsumos = async (req: Request, res: Response) => {
    const { user, startDate, endDate } = req.query;
    const whereClause: any = {};

    if (user) {
      whereClause['user_id'] = user;
    }
    if (startDate && endDate) {
      const start = new Date(startDate.toString());
      const end = new Date(endDate.toString());
      whereClause['createdAt'] = {
        [Op.between]: [start, end.setDate(end.getDate() + 1)],
      };
    }
    const insumos = await InsumoModel(['user']).findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
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
        user_id: req.user.id,
      });
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
  totalInsumo = async (req: Request, res: Response) => {
    const totalInsumos = await InsumoModel().count();
    const quantityInsumos = await InsumoModel().sum('cantidad');

    res.json({
      ok: true,
      totalInsumos,
      quantityInsumos,
    });
  };
  createPDF = async (req: any, res: Response) => {
    const {id} = req.user;
    const {startDate,endDate, user, categoria} = req.body;
    const whereClause: any = {};

    try {
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
      const insumos  = await InsumoModel([ 'user']).findAll({
        where: whereClause,
        include: [
          {
            model: UsuarioModel(),
            as: 'user'
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
        columns: await createPDFHeader('Reporte de Insumo'),
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
  
          body: await createFacturaSection(insumos),
        },
    }
    const pdf: any = {
      content: [header, dataTable.table.body ? dataTable : undefined ],
      footer: createFooter
    };
    pdfMake.createPdf(pdf).getBuffer(async (data) => {
      const sendMail = new SendMail('inventario');

      await sendMail.send(options, 'Reporte de Insumo', data);
    });
    res.json({
      ok: true,
      msg: 'PDF creado exitosamente',
      insumos
    });
      
      
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error}`
      })
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
            text: 'Insumo',
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
            text: 'Nombre de Insumo:',
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
            text: 'Creado por:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.user.nombre,
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
        // data.push([
        //   {
        //     text: 'Fecha de creacion:',
        //     color: '#657685',
        //     bold: true,
        //     border: border,
        //     borderColor: borderTitle,
        //   },
        //   {
        //     text: moment(e.createdAt).format('DD/MM/YYYY'),
        //     color: '#657685',
        //     border: border,
        //     borderColor: borderText,
        //   },
        // ]);
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
  
  };
}
