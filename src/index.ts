import express from "express"
import { client } from "./db";

const app = express();

app.use(express.json());

//db connection
client.connect()

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


app.listen(5000,()=>{
    console.log("App is listening")
})