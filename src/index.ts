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

app.post("/address",async(req,res)=>{
    try{
        const city = req.body.city;
        const country = req.body.country;
        const pincode = req.body.pincode;
        const userId = 2 // get it from auth
        //insert in the address table
        const insertQuery = 'INSERT INTO ADDRESSES(city,country,pincode,userId) VALUES($1,$2,$3,$4)';
        const response =await client.query(insertQuery,[city,country,pincode,userId]);
        console.log("response",response);
        res.json({
            message:"Successfully inserted the message"
        })

    }
    catch(e){
        console.log("err",e)
        res.status(500).json({
            message:"Internal server error"
        })
    }
})


app.listen(5000,()=>{
    console.log("App is listening")
})