# 1. 파이썬 버전을 3.11로 유지
FROM python:3.12-slim

# 2. 필수 빌드 도구 설치 (whl 설치 시 필요한 경우 대비)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app



# 3. 나머지 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir numpy==2.4.4
RUN pip install --no-cache-dir prophet==1.3.0
RUN pip install --no-cache-dir -r requirements.txt

# 4. 소스 코드 복사
COPY main.py .

# 5. 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]