# 1. 파이썬 버전 변경
FROM python:3.11-slim

# 2. 필수 빌드 도구 및 Prophet 설치를 위한 라이브러리 추가
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip 

#[중요] Prophet 설치 시 메모리 부족이나 빌드 에러 방지를 위해 
# 무거운 패키지들을 개별적으로 먼저 설치해볼 수 있습니다.
RUN pip install --no-cache-dir numpy==2.4.4
RUN pip install --no-cache-dir prophet==1.3.0
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사
COPY main.py .

# 6. FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]