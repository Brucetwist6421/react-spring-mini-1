// 1. 백엔드와 주고받을 데이터의 TypeScript 타입 정의
export interface RobotLog {
  id?: number;
  robot_name: string;
  status: 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'ERROR';
  command: string;
  created_at?: string;
}

// 백엔드 Express 서버 주소 기본 세팅 (포트 5000번 조준)
const BASE_URL = 'http://localhost:5000/api/robots';

export const robotApi = {
  // 🟢 READ: 모든 로봇 로그 조회
  getLogs: async (): Promise<RobotLog[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('데이터 로드 실패');
    const result = await response.json();
    return result.data;
  },

  // 🔵 CREATE: 새로운 로봇 로그 등록
  createLog: async (log: RobotLog): Promise<RobotLog> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('데이터 저장 실패');
    const result = await response.json();
    return result.data;
  },

  // 🟡 UPDATE: 로봇 로그 수정
  updateLog: async (id: number, log: Partial<RobotLog>): Promise<RobotLog> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('데이터 수정 실패');
    const result = await response.json();
    return result.data;
  },

  // 🔴 DELETE: 로봇 로그 삭제
  deleteLog: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('데이터 삭제 실패');
  }
};