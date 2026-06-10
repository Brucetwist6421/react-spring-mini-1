import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '6543', 10),
  ssl: {
    rejectUnauthorized: false
  },
  // 💡 핵심: 연결 시 자동으로 robotics 스키마를 먼저 탐색하도록 설정
  options: '-c search_path=robotics,public' 
});

export const connectDB = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ [DB SUCCESS] Supabase PostgreSQL (robotics 스키마) 연동 성공!');
  } catch (error) {
    console.error('❌ [DB ERROR] 데이터베이스 연결 중 오류 발생:', error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};