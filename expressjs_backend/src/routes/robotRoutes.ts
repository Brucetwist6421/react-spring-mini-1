import { Router } from 'express';
import { getRobotLogs, createRobotLog } from '../controllers/robotController.js';

const router = Router();

// GET /api/robots -> 로봇 로그 목록 가져오기
router.get('/', getRobotLogs);

// POST /api/robots -> 로봇 로그 생성하기
router.post('/', createRobotLog);

export default router;