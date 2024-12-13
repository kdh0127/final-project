from flask_sqlalchemy import SQLAlchemy

# SQLAlchemy 객체 생성
db = SQLAlchemy()

# 모델 임포트 (사용자가 필요할 때 자동으로 가져오도록 설정)
from .user import User
from .posts import Posts
from .comments import Comments
