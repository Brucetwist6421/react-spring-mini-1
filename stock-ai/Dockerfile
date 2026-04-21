# 1. 파이썬 버전을 3.11로 유지
FROM python:3.11-slim

# 2. 필수 빌드 도구 설치 (whl 설치 시 필요한 경우 대비)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. 로컬의 whl 파일을 복사 및 강제 설치
# 파일명이 정확해야 하므로 아래 줄을 꼭 확인하세요.
COPY pandas_ta-0.4.71b0-py3-none-any.whl .
RUN pip install --no-cache-dir pandas_ta-0.4.71b0-py3-none-any.whl

# 4. 나머지 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir numpy==2.4.4
RUN pip install --no-cache-dir prophet==1.3.0
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사
COPY main.py .

# 6. 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]