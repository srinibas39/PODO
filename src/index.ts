import express from "express"
import { client } from "./db";
import  Jwt  from "jsonwebtoken";

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
        console.log(result)
        res.status(200).json({
            message:"succesfully signed in"
        })

    }
    catch(e){
        console.log("err",e)
        res.status(400).json({
            message:"Error in sign up"
        })

    }
})

app.post("/signin",async (req,res)=>{
    try{
        const {email,password} = req.body
        //first check whether user exist or not
        const query = 'SELECT * FROM users WHERE email=$1 AND password=$2'
        const result = await client.query(query,[email,password]);
        if(!result?.rows[0]){
            res.json({
                message:"user does not exist"
            })
        }
        if(secretKey){
            const token =await Jwt.sign({email},secretKey)
            res.json({
                token
            })
            
        }
        res.json({
            message:"Internal server error"
        })
    }
    catch(e){
        console.log(e)
        res.status(400).json({
            message:"Error in signing in"
        })
    }
})




app.listen(5000,()=>{
    console.log("App is listening")
})