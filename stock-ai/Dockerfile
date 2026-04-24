FROM python:3.12-slim

# 빌드에 필요한 도구 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 1. 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 2. 소스 코드 및 환경 설정 파일 복사
# .env 파일이 루트에 있다면 함께 복사되도록 설정 (배포 방식에 따라 선택)
COPY app/ ./app/

# 3. 파이썬 경로 명시 (Import 에러 방지를 위한 안전장치)
ENV PYTHONPATH=/app

# 4. 실행 명령어
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]