from models import db

class Posts(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.String(30), primary_key=True, nullable=False)
    user_id = db.Column(db.String(30), db.ForeignKey('user.user_id'), nullable=False)
    title = db.Column(db.String(30), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    imagepath = db.Column(db.String(300), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comments', back_populates='post', cascade='all, delete-orphan')
