import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
    _id: string,
    name:string,
    email:string
}

export interface AuthenticatedRequest extends Request{
    user?: IUser | null;
}

export const isAuth =async(req: AuthenticatedRequest, res: Response, next: NextFunction):
 Promise<void> => {
    try {
        const authHeaders = req.headers.authorization;

        if(!authHeaders || !authHeaders.startsWith("Bearer ")){
            res.status(401)
            .json({
                message:"Please Login - No Auth Header "
            })
            return;
        }

         const token =  authHeaders.split(" ")[1];

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
            message:"PLease Login "
        })
    }
 }