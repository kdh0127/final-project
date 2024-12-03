from models import db

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.String(30), primary_key=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    realname = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    number = db.Column(db.Integer, unique=True, nullable=False, autoincrement=True)

    # Relationships
    posts = db.relationship('Posts', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comments', back_populates='user', cascade='all, delete-orphan')
