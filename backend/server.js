import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './db/mongodb.js';
import authRouter from './routes/auth_routes.js';
import turfRouter from './routes/turf_routes.js';
import bookingRouter from './routes/booking_routes.js';
import matchRouter from './routes/match_routes.js';
import requestRouter from './routes/request_routes.js';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/turfs", turfRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/matches", matchRouter)
app.use("/api/requests", requestRouter)

app.get("/", (req, res)=>{
    res.send("PlayOrbit Backend")
})

app.listen(5000,()=>{
    console.log("Server running on port 5000")
    connectToDatabase();
})