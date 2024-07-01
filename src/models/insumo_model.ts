import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/connection';
import { UsuarioModel } from './usuario_model';
type includes = 'user';
export const InsumoModel = (include?: includes[]) => {
  const model = ConnectionDB.db.define<Model<IInsumo>>(
    'insumos',
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

      user_id: {
        type: DataTypes.INTEGER,
      },

      cantidad: {
        type: DataTypes.INTEGER,
      },
      observacion_general: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'insumos',
    }
  );
  if (include && include.includes('user')) {
    model.hasOne(UsuarioModel(), {
      foreignKey: 'id',
      sourceKey: 'user_id',
      as: 'user',
    });
  }

  return model;
};

export interface IInsumo {
  id?: number;
  nombre_producto: string;
  cantidad: number;
  user_id: number;
  observacion_general: string;
}
