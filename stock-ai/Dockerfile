# 1. 파이썬 버전
FROM python:3.11-slim

# 2. 필수 빌드 도구 및 git 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. pandas-ta 수동 설치 (가장 확실한 방법)
# 캐시 문제를 피하기 위해 requirements 설치 전에 먼저 수행합니다.
RUN git clone https://github.com/twopirllc/pandas-ta.git /tmp/pandas-ta \
    && cd /tmp/pandas-ta \
    && python setup.py install \
    && rm -rf /tmp/pandas-ta

# 4. 나머지 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir numpy==2.4.4
RUN pip install --no-cache-dir prophet==1.3.0
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 복사
COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]