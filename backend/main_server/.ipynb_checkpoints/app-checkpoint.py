from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_session import Session
from models import db
from routes import auth_blueprint, predict_blueprint, qa_blueprint
from utils.webcam_client import get_diagnosis, stream_video

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

# 클라이언트 
@app.route("/api/webcam/diagnose", methods=["GET"])
def webcam_diagnose():
    """
    웹캠 서버의 진단 결과를 반환.
    """
    result = get_diagnosis()
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result)

@app.route("/api/webcam/video_feed", methods=["GET"])
def webcam_video_feed():
    """
    웹캠 서버의 스트리밍 데이터를 중계.
    """
    try:
        def generate():
            for chunk in stream_video():
                yield chunk

        return Response(generate(), content_type="multipart/x-mixed-replace; boundary=frame")
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

# 블루프린트 등록
app.register_blueprint(auth_blueprint, url_prefix='/api')
app.register_blueprint(predict_blueprint, url_prefix='/api')
app.register_blueprint(qa_blueprint, url_prefix='/api')

# 데이터베이스 초기화
with app.app_context():
    db.create_all()

# 메인 실행 코드
if __name__ == "__main__":
    app.run(port=5000, debug=True)
