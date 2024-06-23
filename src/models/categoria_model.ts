import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/connection';

export const CategoriaModel = () => {
  const model = ConnectionDB.db.define<Model<ICategoria>>(
    'categorias',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      nombre: {
        type: DataTypes.ENUM('cocina', 'sala'),
      },
    },
    {
      tableName: 'categorias',
    }
  );

  return model;
};

interface ICategoria {
  id: number;
  nombre: 'cocina' | 'sala';
}
