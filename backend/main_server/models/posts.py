from models import db

class Posts(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 게시글 ID
    user_id = db.Column(db.String(255), db.ForeignKey('user.user_id'), nullable=False)  # 작성자
    title = db.Column(db.String(255), nullable=False)  # 제목
    text = db.Column(db.Text, nullable=False)  # 내용
    imagepath = db.Column(db.String(255))  # 이미지 경로
    category = db.Column(db.String(50), nullable=False)  # 게시글 분류
    version = db.Column(db.Integer, default=1, nullable=False)  # 버전
    views = db.Column(db.Integer, default=0) # 조회수 필드 추가
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)  # 작성일
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp(), nullable=False)  # 수정일


    # Relationships
    user = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comments', back_populates='post', cascade='all, delete-orphan')

