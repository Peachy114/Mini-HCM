import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getDailyReport, getWeeklyReport,getAttendanceByDate, editAttendance } from '../controllers/adminReportController.js';

const router = express.Router();

router.get('/daily', verifyToken, requireAdmin, getDailyReport);
router.get('/weekly', verifyToken, requireAdmin, getWeeklyReport);
router.get('/attendance', verifyToken, requireAdmin, getAttendanceByDate);
router.patch('/attendance/:id', verifyToken, requireAdmin, editAttendance);

export default router;