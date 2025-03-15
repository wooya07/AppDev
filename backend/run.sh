#!/bin/bash
# 가상 환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows의 경우: venv\Scripts\activate

# 필요한 패키지 설치
pip install -r requirements.txt

# 서버 실행
python main.py

