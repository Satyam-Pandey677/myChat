import express from "express"
import { startSendOTPConsumer } from "./consumer.js";

startSendOTPConsumer();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server run on port ${process.env.PORT}`)
})
