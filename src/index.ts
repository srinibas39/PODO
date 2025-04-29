import { Client } from "pg";
import dotenv from "dotenv"
dotenv.config()
//create a function

const insertData = async()=>{
   const client = new Client({
        connectionString : process.env.DB_URL,
        ssl:{
            rejectUnauthorized:false
        }

   }
)
  try{
        await client.connect();
        const insertQuery = "INSERT INTO users(username,email,password) VALUES('mitra','mitra91@gmail.com','123d4');"
        const res = await client.query(insertQuery);
        console.log(res);
  }
  catch(e){
    console.log(e)
    console.error("Error while inserting to database")
  }
  finally{
        await client.end()
  }

}

insertData();