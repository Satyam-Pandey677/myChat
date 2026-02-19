import express from "express";
import { dbConnect } from "./config/DB.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cors());

dbConnect();

import chatRouter from "./routers/chatRouter.js";
app.use("/api/v1", chatRouter);

app.listen(port, () => {
    console.log(`Chat Server running on  port: ${port}`);
})