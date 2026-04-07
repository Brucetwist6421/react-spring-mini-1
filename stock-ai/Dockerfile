# 1. 파이썬 3.9 이상 베이스 이미지 사용 (Prophet 설치를 위해 가벼운 slim 버전보다 일반 버전 권장)
FROM python:3.9-slim

# 2. 필수 빌드 도구 설치 (Prophet은 컴파일 도구가 필요할 수 있음)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사
COPY main.py .

# 6. FastAPI 실행 (uvicorn)
# main.py 안에 app = FastAPI() 가 있다고 가정합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]