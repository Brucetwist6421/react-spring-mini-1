# 1. 파이썬 버전을 3.9에서 3.11로 변경 (anyio 4.13.0 호환을 위함)
FROM python:3.11-slim

# 2. 필수 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 의존성 파일 복사 및 설치
COPY requirements.txt .
# pip 자체를 먼저 업로드하면 설치 에러를 줄일 수 있습니다.
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사
COPY main.py .

# 6. FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]