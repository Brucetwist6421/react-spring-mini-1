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

# 2. 모든 파일 복사 (루트에 있는 main.py와 app 폴더 전체를 복사)
# 현재 경로(.)의 모든 것을 컨테이너의 현재 작업 디렉토리(/app)로 복사합니다.
COPY . .

# 3. 파이썬 경로 명시
ENV PYTHONPATH=/app

# 4. 실행 명령어 수정
# main.py가 루트에 있으므로 "main:app"으로 호출해야 합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]