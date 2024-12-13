from models import db

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.String(255), primary_key=True)  # 사용자 ID
    password = db.Column(db.String(255), nullable=False)  # 비밀번호
    realname = db.Column(db.String(100), nullable=False)  # 실명
    address = db.Column(db.String(255))  # 주소
    phone = db.Column(db.String(15))  # 전화번호
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # 가입일

    # Relationships
    posts = db.relationship('Posts', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comments', back_populates='user', cascade='all, delete-orphan')
