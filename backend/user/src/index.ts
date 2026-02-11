import express from "express"
import { dbConnect } from "./config/DB.js";
import {createClient} from "redis"

const app = express();
const port = process.env.PORT || 8000;


dbConnect();

export const redisClient = createClient({
    url:`${process.env.REDIS_URL}`,
});

redisClient.connect().then(() => console.log("connnected to redis"))

import userRoute from "./routes/userRouter.js"

app.use("/api/v1/user",userRoute)

app.listen(port, () => {
    console.log(`server running on : http://localhost:${port}`)
})


