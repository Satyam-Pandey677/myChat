import { response } from "express";
import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../index.js";
import { USER } from "../model/userModel.js";
import TryCatch from "../utils/TryCatch.js"


export const loginUser = TryCatch(async(req, res) => {
    const {email} = req.body;

    const rateLimitKey = `otp: ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);

    if(rateLimit){
        res.status(429)
        .json({
            message:"Too many request. Please wait before requesting new otp"
        });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp: ${email}`;

    await redisClient.set(otpKey, otp, {
        EX:300,
    })

    await redisClient.set(rateLimitKey, "true", {
        EX:60,
    });

    const message = {
        to: email,
        subject: "Your otp Code",
        body: `Yout OTP is ${otp}. It is valid for 5 minutes`
    };

    await publishToQueue("send-otp", message);

    res.status(200)
    .json({
        message:"OTP sent to you email"
    })
})


export const verifyUser = TryCatch(async(req, res) => {
    const {email, otp:enteredOtp} = req.body;

    if(!email || !enteredOtp){
        res.status(400)
        .json({
            message:"Email and OTP is required"
        });
        return;
    }

    const otpKey = `otp: ${email}`;

    const storedOTP = await redisClient.get(otpKey);

    if(!storedOTP || storedOTP !== enteredOtp){
        res.status(400)
        .json({
            message: "Invalid or expired OTP"
        });
        return;
    }

    await redisClient.del(otpKey);

    let user =await USER.findOne({email})

    if(!user){
        const name = email.slice(0,8);
        user = await USER.create({name,email})
    }


    const token = generateToken(user);

    res.status(200)
    .json({
        message:"User Verfied",
        user,
        token  
    })
})