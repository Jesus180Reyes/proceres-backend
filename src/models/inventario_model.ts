import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/connection';
import { CategoriaModel } from './categoria_model';
import { UsuarioModel } from './usuario_model';

type includes = 'categoria' | 'user';

export const InventarioModel = (include?: includes[]) => {
  const model = ConnectionDB.db.define<Model<IInventario>>(
    'inventario',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      nombre_producto: {
        type: DataTypes.STRING,
      },

      cantidad: {
        type: DataTypes.INTEGER,
      },
      categoria_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      observacion_general: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'inventario',
    }
  );

  if (include && include.includes('categoria')) {
    model.hasOne(CategoriaModel(), {
      foreignKey: 'id',
      sourceKey: 'categoria_id',
      as: 'categoria',
    });
  }
  if (include && include.includes('user')) {
    model.hasOne(UsuarioModel(), {
      foreignKey: 'id',
      sourceKey: 'user_id',
      as: 'usuario',
    });
  }
  return model;
};

export interface IInventario {
  id: number;
  nombre_producto: string;
  cantidad: number;
  categoria_id: number;
  user_id: number;
  observacion_general?: string;
}
