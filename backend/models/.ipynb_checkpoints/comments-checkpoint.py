from models import db

class Comments(db.Model):
    __tablename__ = 'comments'
    comments_id = db.Column(db.String(30), primary_key=True, nullable=False)
    post_id = db.Column(db.String(30), db.ForeignKey('posts.post_id'), nullable=False)
    user_id = db.Column(db.String(30), db.ForeignKey('user.user_id'), nullable=False)
    text = db.Column(db.String(500), nullable=False)

    # Relationships
    post = db.relationship('Posts', back_populates='comments')
    user = db.relationship('User', back_populates='comments')
