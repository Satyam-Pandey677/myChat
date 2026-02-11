import jwt from "jsonwebtoken";

const JWT_SECRATE = process.env.JWT_SECRATE as string;

export const generateToken = (user:any) => {
    return jwt.sign({user}, JWT_SECRATE, {
        expiresIn:"15d"
    })
}