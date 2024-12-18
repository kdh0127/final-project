from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_session import Session
from models import db
from routes import auth_blueprint, predict_blueprint, qa_blueprint, post_blueprint, comment_blueprint


# Flask 애플리케이션 초기화
app = Flask(__name__, static_url_path='', static_folder='uploads')

# 애플리케이션 설정
app.config['SECRET_KEY'] = 'your_secret_key'  # 세션을 위한 비밀 키
app.config['SESSION_TYPE'] = 'filesystem'  # 세션 타입
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/user_db'  # MySQL 데이터베이스 URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # SQLAlchemy 경고 비활성화
app.config['UPLOAD_FOLDER'] = 'uploads'  # 파일 업로드 폴더
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # HTTPS 사용 시 True로 설정 (개발 단계에서는 False)

# 확장 모듈 초기화
db.init_app(app)
Session(app)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "http://localhost:3000",  # 클라이언트 도메인
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # 허용할 HTTP 메서드
        "allow_headers": ["Content-Type", "Authorization"],  # 허용할 헤더
    }
})



# 블루프린트 등록
app.register_blueprint(auth_blueprint, url_prefix='/api')
app.register_blueprint(predict_blueprint, url_prefix='/api')
app.register_blueprint(qa_blueprint, url_prefix='/api')
app.register_blueprint(post_blueprint, url_prefix='/api')
app.register_blueprint(comment_blueprint, url_prefix='/api')


# 데이터베이스 초기화
with app.app_context():
    db.create_all()

# 메인 실행 코드
if __name__ == "__main__":
    app.run(port=5000, debug=True)
