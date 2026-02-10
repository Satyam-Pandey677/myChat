import express from "express"
import { dbConnect } from "./config/DB.js";

const app = express();
const port = 5000;


dbConnect()


app.route("/").get((req, res) => {
    res.send("hello there")
})

app.listen(port, () => {
    console.log(`server running on : http://localhost:${port}`)
})


