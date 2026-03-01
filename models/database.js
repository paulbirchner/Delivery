import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DB_CON_STRING,
    ssl: {rejectUnauthorized: false},
})

export default pool;