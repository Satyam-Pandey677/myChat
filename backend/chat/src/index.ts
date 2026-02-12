import express from "express";
import { dbConnect } from "./config/DB.js";

const app = express();
const port = process.env.PORT || 8000;

dbConnect();

app.listen(port, () => {
    console.log(`Chat Server running on  port: ${port}`);
})