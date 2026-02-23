import express from 'express';
import { verifyToken } from "../middleware/verifyToken.js";
import { 
    punchIn,
    punchOut,
    getToday,
    getTodaySummary,
    getHistory
} from '../controllers/attendanceController.js';

const router = express.Router();


router.post('/punch-in', verifyToken, punchIn);
router.post('/punch-out', verifyToken, punchOut);

router.get('/today', verifyToken, getToday);
router.get('/summary/today', verifyToken, getTodaySummary);
router.get('/history', verifyToken, getHistory);

export default router;
