import express from "express"
import { client } from "./db";
import  Jwt  from "jsonwebtoken";
import { auth } from "./middleware";

const app = express();

app.use(express.json());

//db connection
client.connect()

const secretKey = process.env.SECRETKEY;

app.post("/signup",async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const query = 'INSERT INTO users(username,email,password) VALUES($1,$2,$3)';
        const result =await client.query(query,[username,email,password])
        console.log("resull",result)
        res.status(200).json({
            message:"succesfully signed in"
        })

    }
    catch(e){
        res.status(400).json({
            message:"Error in sign up"
        })

    }
})

app.post("/signin",async (req,res)=>{
    try{
        const {email,password} = req.body
        //first check whether user exist or not
        const query = 'SELECT u.id, u.email , u.password FROM users u WHERE email=$1 AND password=$2'
        const {rows} = await client.query(query,[email,password]);
        if(!rows){
            res.json({
                message:"user does not exist"
            })
        }
   
        const token =await Jwt.sign({id:rows[0].id},secretKey as string)
        res.json({
            token
        })
            
  
    }
    catch(e){
        res.status(400).json({
            message:"Error in signing in"
        })
    }
})

//create
app.post("/todo",auth, async(req,res)=>{
    try{
        const userId = parseInt(req.id);
        const {title,description,done} = req.body;
        const insertQuery = 'INSERT INTO todos(title,description,done,"userId") VALUES($1,$2,$3,$4)';
        const response = await client.query(insertQuery,[title,description,done,userId]);
        res.status(200).json({
            message:"Todo created"
        })
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

//get all todos
app.get("/todos",auth,async(req,res)=>{
    try{
        const userId = parseInt(req.id);
        const fetchQuery = 'SELECT t.id, t.title , t.description , t.done , u.username , u.email  FROM todos t JOIN users u ON u.id = t."userId" WHERE "userId"=$1'
        const response = await client.query(fetchQuery,[userId]);
        res.status(200).json({
            todos:response.rows
        })
    }
    catch(e){
        res.status(200).json({
            message:"Internal server error"
        })
    }
})

//get single todo
app.get("/todos/:id",auth,async(req,res)=>{
    try{
        const todoId = parseInt(req.params.id);
        const userId = parseInt(req.id);
        const fetchQuery = 'SELECT t.id, t.title , t.description , t.done , u.username , u.email FROM todos t JOIN users u ON u.id = t."userId" WHERE t."userId"=$1 AND t.id=$2'
        const response = await client.query(fetchQuery,[userId,todoId]);
        res.json({
            todos:response.rows
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

//update todo
app.put("/todos/:id",auth,async(req,res)=>{
    try{
        const todoId = parseInt(req.params.id);
        const userId = parseInt(req.id); //get it fro auth

        const {title,description,done} = req.body;

        const updateQuery = 'UPDATE todos SET title=$1,description=$2,done=$3 WHERE id=$4 AND "userId"=$5 RETURNING *'
        const response = await client.query(updateQuery,[title,description,done,todoId,userId]);
        res.status(200).json({
            updatedTodo:response.rows[0]
        })


    }
    catch(err){
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

//delete todo
app.delete("/todos/:id",auth,async(req,res)=>{
 try{
    const userId = parseInt(req.id);
    const todoId = parseInt(req.params.id)
    const deleleQuery = 'DELETE FROM todos WHERE id=$1 AND "userId"=$2 RETURNING *';
    const {rows} = await client.query(deleleQuery,[todoId,userId]);
    res.status(200).json({
        deletedTodo:rows
    })
 }
 catch(e){
    res.status(200).json({
        message:"Internal server error"
    })
 }
})

// app.post("/address",async(req,res)=>{
//     try{
//         //users
//         const username = req.body.username;
//         const email = req.body.email;
//         const password = req.body.password;

//         //for addresses
//         const city = req.body.city;
//         const country = req.body.country;
//         const pincode = req.body.pincode;
//         // const userId = 2 // get it from auth
//         //insert in the address table
//         await client.query("BEGIN");
//         const userInsertQuery = 'INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id';
//         const response = await client.query(userInsertQuery,[username,email,password])
//         console.log(response)
//         const userId = response.rows[0].id

//         const insertQuery = 'INSERT INTO ADDRESSES(city,country,pincode,userId) VALUES($1,$2,$3,$4)';
//         const responsew =await client.query(insertQuery,[city,country,pincode,userId]);
//         console.log(responsew)

//         await client.query("COMMIT");
//         // console.log("response",response);
//         res.json({
//             message:"Successfully inserted the message"
//         })

//     }
//     catch(e){
//         console.log("err",e)
//         res.status(500).json({
//             message:"Internal server error"
//         })
//     }
// })

// app.get("/joins",async(req,res)=>{
//     try{
//         const query = 'SELECT u.username , u.email , a.city , a.country , a.pincode FROM users u LEFT JOIN addresses a ON u.id = a.userid WHERE u.id=$1';
//         const r = await client.query(query,[2]);
//         res.json({
//             info:r.rows
//         })
//     }
//     catch(e){
//         console.log(e)
//         res.status(500).json({
//             message:"Internal Server error"
//         })
//     }
// })


app.listen(5000,()=>{
    console.log("App is listening")
})