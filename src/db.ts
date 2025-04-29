import { Client } from "pg";
import dotenv from "dotenv"
dotenv.config()

export const client = new Client({
    connectionString:process.env.DB_URL,
    ssl:{
        rejectUnauthorized:false
    }
})

