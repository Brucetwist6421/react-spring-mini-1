import type { Request, Response } from 'express';
import { pool } from '../config/db.js';

// 1. 모든 로봇 상태/작업 로그 조회 (GET)
export const getRobotLogs = async (req: Request, res: Response) => {
  try {
    // ⚠️ 테이블명(robot_logs)이나 컬럼명은 기존 Supabase에 생성해 둔 스펙에 맞게 자유롭게 수정하세요!
    const result = await pool.query('SELECT * FROM robot_logs ORDER BY created_at DESC LIMIT 50');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('❌ 로그 조회 중 오류:', error.message);
    res.status(500).json({ success: false, message: '데이터 조회 실패' });
  }
};

// 2. 새로운 로봇 상태/작업 지시 기록 생성 (POST)
export const createRobotLog = async (req: Request, res: Response) => {
  const { robot_name, status, command } = req.body;
  
  try {
    const query = `
      INSERT INTO robot_logs (robot_name, status, command, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const values = [robot_name, status, command];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: '로봇 상태가 성공적으로 기록되었습니다.',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('❌ 로그 생성 중 오류:', error.message);
    res.status(500).json({ success: false, message: '데이터 저장 실패' });
  }
};

// 3. 로봇 상태 및 작업 지시 수정 (PUT)
export const updateRobotLog = async (req: Request, res: Response) => {
  const { id } = req.params; // URL 경로에서 id 추출 (예: /api/robots/3)
  const { status, command } = req.body;

  try {
    const query = `
      UPDATE robotics.robot_logs 
      SET status = $1, command = $2 
      WHERE id = $3
      RETURNING *
    `;
    const values = [status, command, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: '해당 로그를 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      message: '로봇 상태가 성공적으로 업데이트되었습니다.',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('❌ 로그 수정 중 오류:', error.message);
    res.status(500).json({ success: false, message: '데이터 수정 실패' });
  }
};

// 4. 로봇 로그 삭제 (DELETE)
export const deleteRobotLog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM robotics.robot_logs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: '해당 로그를 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      message: '로봇 로그가 안전하게 삭제되었습니다.'
    });
  } catch (error: any) {
    console.error('❌ 로그 삭제 중 오류:', error.message);
    res.status(500).json({ success: false, message: '데이터 삭제 실패' });
  }
};