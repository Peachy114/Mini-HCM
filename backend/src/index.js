import dotenv from "dotenv";
import express from "express";
import cors from "cors";

//routes
import authRoutes from './routes/auth.js'; //login, register route
import admin_routes from "./routes/admin_routes.js";//admin routes
import admin_report_routes from "./routes/admin_report_routes.js";
import attendance_routes from "./routes/attendance_routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//security
app.use(cors({ origin: process.env.FRONTEND_URL}));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/employees", admin_routes); //admin
app.use("/api/admin/reports",   admin_report_routes);
app.use("/api/attendance", attendance_routes);


//health check and listen 
app.get("/", (req, res) => res.json({ message: 'Hcm backend is running.'}));
app.listen(port, () => console.log(`Backend is running on port ${port}`));
