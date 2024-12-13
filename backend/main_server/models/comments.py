from models import db

class Comments(db.Model):
    __tablename__ = 'comments'
    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 댓글 ID
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), nullable=False)  # 댓글이 달린 게시글
    user_id = db.Column(db.String(255), db.ForeignKey('user.user_id'), nullable=False)  # 댓글 작성자
    text = db.Column(db.Text, nullable=False)  # 댓글 내용
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)  # 댓글 작성일
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('comments.comment_id'), nullable=True)  # 대댓글의 부모 댓글 ID

    # Relationships
    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Posts', back_populates='comments')
    parent_comment = db.relationship('Comments', remote_side=[comment_id])  # 부모 댓글
    children = db.relationship('Comments', backref=db.backref('parent', remote_side=[comment_id]), cascade='all, delete-orphan')  # 자식 댓글
