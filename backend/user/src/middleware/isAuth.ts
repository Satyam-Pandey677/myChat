import jwt, { type JwtPayload } from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import type { IUser } from "../model/userModel.js";


export interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

export const isAuth = async(req:AuthenticatedRequest, res:Response, next:NextFunction):
Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401)
            .json({
                message:"PLease login -No Auth Header"
            })
            return;
        }

        const token =  authHeader.split(" ")[1];

        const decodedValue = jwt.verify(token as string, process.env.JWT_SECRATE as string) as JwtPayload

        if(!decodedValue || !decodedValue.user){
            res.status(401)
            .json({
                message:"Invalid token"
            })
            return;
        }

        req.user = decodedValue.user

        next();

    } catch (error) {
        res.status(401)
        .json({
            message:"Please Login - JWT error"
        })
    }
}