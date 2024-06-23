import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/connection';

export const UsuarioModel = () => {
  const model = ConnectionDB.db.define<Model<IUsuario>>(
    'usuarios',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      nombre: {
        type: DataTypes.STRING,
      },

      email: {
        type: DataTypes.STRING,
      },

      password: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'usuarios',
    }
  );

  return model;
};

interface IUsuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
}
