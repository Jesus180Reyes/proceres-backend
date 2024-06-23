import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/connection';
import { UsuarioModel } from './usuario_model';
type includes = 'user';

export const MovimientoModel = (include?: includes[]) => {
  const model = ConnectionDB.db.define<Model<IMovimiento>>(
    'movimientos',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
      },

      description: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      tipo_movimiento: {
        type: DataTypes.ENUM('entrada', 'salida', 'otros'),
      },
    },
    {
      tableName: 'movimientos',
    }
  );

  if (include && include.includes('user')) {
    model.hasOne(UsuarioModel(), {
      foreignKey: 'id',
      sourceKey: 'user_id',
      as: 'usuario',
    });
  }

  return model;
};

interface IMovimiento {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  tipo_movimiento: 'entrada' | 'salida' | 'otros';
}
