import dotenv from 'dotenv'
dotenv.config()

const config = {
  pg_db_host: process.env.PG_HOST,
  pg_db_port: process.env.PG_PORT,
  pg_db_user: process.env.PG_USER,
  pg_db_name: process.env.PG_DB_NAME,
  pg_db_password: process.env.PG_PASSWORD,
}

export default config