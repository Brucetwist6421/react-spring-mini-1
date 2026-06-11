# 1. 가볍고 보안성이 높은 Node v24 Alpine 이미지 베이스 선택
FROM node:24-alpine

# 2. 컨테이너 내부의 앱 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 의존성 파일들만 먼저 복사 (도커 캐시 메커니즘 활용으로 빌드 속도 최적화)
COPY package*.json ./

# 4. 의존성 라이브러리 설치
RUN npm install

# 5. 소스코드 전체 복사
COPY . .

# 6. TypeScript 코드를 JavaScript(dist/)로 컴파일 빌드
RUN npm run build

# 7. Express 서버 포트 개방
EXPOSE 5000

# 8. 컨테이너 구동 시 순수 노드로 안전하게 프로덕션 실행
CMD ["node", "dist/index.js"]