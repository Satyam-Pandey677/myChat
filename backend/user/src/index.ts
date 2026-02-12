import express from "express";
import { dbConnect } from "./config/DB.js";
import {createClient} from "redis";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;


app.use(express.json())
app.use(cors());

connectRabbitMQ();
dbConnect();



export const redisClient = createClient({
    url:`${process.env.REDIS_URL}`,
});

redisClient.connect().then(() => console.log("connnected to redis"))

import userRoute from "./routes/userRouter.js"
import { connectRabbitMQ } from "./config/rabbitmq.js";

app.use("/api/v1",userRoute)

app.listen(port, () => {
    console.log(`server running on : http://localhost:${port}`)
})


