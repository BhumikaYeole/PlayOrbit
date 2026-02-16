import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './db/mongodb.js';
import authRouter from './routes/auth_routes.js';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter)

app.get("/", (req, res)=>{
    res.send("PlayOrbit Backend")
})

app.listen(5000,()=>{
    console.log("Server running on port 5000")
    connectToDatabase();
})