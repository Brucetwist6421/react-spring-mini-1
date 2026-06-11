import express, {type Request, type Response } from 'express'; // 타입 추가
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import robotRouter from './routes/robotRoutes.js'; // 1. 라우터 임포트

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 데이터베이스 커넥션
connectDB();

// 2. 라우터 미들웨어 등록
app.use('/api/robots', robotRouter);

// 기본 헬스체크
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', message: '백엔드 정상 작동 중' });
});

try {
  app.listen(PORT, () => {
    console.log(`🚀 [SUCCESS] Express 서버가 포트 ${PORT}에서 정상 구동 중입니다.`);
  });
} catch (error) {
  console.error('⚠️ 서버 구동 중 오류:', error);
}