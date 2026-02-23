import express from "express";
import { dbConnect } from "./config/DB.js";
import cors from "cors";
import chatRouter from "./routers/chatRouter.js";
import { app, server } from "./config/socket.js";


const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cors());

dbConnect();

app.use("/api/v1", chatRouter);

server.listen(port, () => {
    console.log(`Chat Server running on  port: ${port}`);
})