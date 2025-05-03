import { NextFunction, Request, Response } from "express"
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { jwtSecret } from "./config";



export const auth = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.authorization;
        if(!token){
            res.status(400).json({
                message:"Error in authentication"
            })
            return;
        }
        const user = jwt.verify(token,jwtSecret as string)
        if(user){
            req.id = (user as JwtPayload).id;
            next()
        }
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }

}