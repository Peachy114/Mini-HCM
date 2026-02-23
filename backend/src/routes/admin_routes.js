import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getAllEmployee, getEmployee, updateEmployee } from '../controllers/adminController.js';

const router = express.Router();

router.get('/', verifyToken, requireAdmin, getAllEmployee);
router.get('/:uid', verifyToken, requireAdmin, getEmployee);
router.patch('/:uid', verifyToken, requireAdmin, updateEmployee);

export default router;