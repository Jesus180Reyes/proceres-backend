import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
export class ConnectionDB {
  public static db = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
    host: DB_HOST,
    database: DB_NAME,
    dialect: 'mysql',
    logging: false,
    port: Number(DB_PORT!),
  });
}
