import dotenv from "dotenv";
import express from "express";
import cors from "cors";

//routes
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

//security
app.use(cors({ origin: process.env.FRONTEND_URL}));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: 'Hcm backend is running.'}));

app.listen(port, () => console.log(`Backend is running on port ${port}`));
