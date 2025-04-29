import { Client } from "pg";
import dotenv from "dotenv"
dotenv.config()
//create a function

// const insertData = async()=>{
//    const client = new Client({
//         connectionString : process.env.DB_URL,
//         ssl:{
//             rejectUnauthorized:false
//         }

//    }
// )
//   try{
//         await client.connect();
//         const insertQuery = 'INSERT INTO users(username,email,password) VALUES($1,$2,$3);'
//         const res = await client.query(insertQuery,["ram","ram@gmail.com","34234"]);
//         console.log(res);
//   }
//   catch(e){
//     console.log(e)
//     console.error("Error while inserting to database")
//   }
//   finally{
//         await client.end()
//   }

// }

// insertData();

const getUser = async(email:string)=>{
    const client = new Client({
        connectionString:process.env.DB_URL,
        ssl:{
            rejectUnauthorized:false
        }
    })
    try{

        await client.connect();
        const fetchQuery = 'SELECT * FROM users WHERE email=$1'
        const res = await client.query(fetchQuery,[email])
        console.log("res",res);
    }   
    catch(e){
        console.log(e)
        console.error("Error in fetching user")
    }
    finally{
        await client.end()
    }
}

getUser("mitra91@gmail.com")