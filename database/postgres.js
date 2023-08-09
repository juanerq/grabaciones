import { Sequelize } from "sequelize"
import config from "../config/index.js"


const URI = `postgres://${config.pg_db_user}:${config.pg_db_password}@${config.pg_db_host}:${config.pg_db_port}/${config.pg_db_name}`;
const sequelize = new Sequelize( URI, {
  logging: false,
  pool: { acquire: 240000, max: 30, idle: 20000 },
  dialect: "postgres",
  timezone: "America/Bogota",
});

(async () => {
  try {
    await sequelize.authenticate();
    //console.log(`[DB] PostgreSQL - Conexión exitosa - ${config.pg_db_host}`);
  } catch (error) {
    console.error("[DB] Unable to connect to the database:", error);
  }
})();

export default sequelize;
