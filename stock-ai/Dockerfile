FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 파일 복사
COPY requirements.txt .

# 개별 패키지 강제 설치(numpy==2.4.4 등)를 지우고 
# pip가 한 번에 해결하도록 맡깁니다.
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]