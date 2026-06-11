import { Router } from 'express';
import { getRobotLogs, createRobotLog, updateRobotLog, deleteRobotLog } from '../controllers/robotController.js';

const router = Router();

// GET /api/robots -> 로봇 로그 목록 가져오기
router.get('/', getRobotLogs);

// POST /api/robots -> 로봇 로그 생성하기
router.post('/', createRobotLog);

// 특정 ID 타겟 경로: /api/robots/:id
router.put('/:id', updateRobotLog);     // 수정
router.delete('/:id', deleteRobotLog);  // 삭제

export default router;