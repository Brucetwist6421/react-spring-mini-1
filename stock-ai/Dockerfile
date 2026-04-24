FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir -r requirements.txt

# 2. 소스 코드 폴더 전체를 컨테이너의 app/ 폴더로 복사
# 현재 로컬의 app/ 폴더 내용을 컨테이너의 /app/app/ 경로로 복사하게 됩니다.
COPY app/ ./app/

# 3. 실행 명령어 수정
# 패키지 구조이므로 'app.main:app' 형식으로 지정해야 합니다.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]