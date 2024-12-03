import os
from flask import Flask, request, jsonify, send_from_directory, session, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from qa_model import create_qa_chain
from dotenv import load_dotenv
from datetime import datetime
#---------------------이미지 모델 관련 import------------------------
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
from io import BytesIO
#----------------------------로그인 관련 import-----------------
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session

#-----------------------cors 설정-----------------------------------

# Flask 애플리케이션 설정
app = Flask(__name__, static_url_path='', static_folder='uploads')
app.config['UPLOAD_FOLDER'] = 'uploads'

CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "http://localhost:3000",  # 클라이언트 도메인
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # 허용할 HTTP 메서드 추가
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],  # 필요한 헤더 추가
    }
})



    
#------------------------------- 세션 &데이터베이스 경로 설정 -------------------------------


# 세션 설정
app.config['SECRET_KEY'] = 'your_secret_key'  # 세션을 위한 비밀 키 설정
app.config['SESSION_TYPE'] = 'filesystem'  # 세션 저장소를 파일 시스템으로 설정

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # 세션 쿠키 전달 
app.config['SESSION_COOKIE_SECURE'] = False    # HTTPS가 아니라면 False (배포 시 True)

# 기본 데이터베이스 (MySQL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/user_db'  # 기본 데이터베이스 URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  



# 세션 초기화
Session(app)

# SQLAlchemy 초기화
db = SQLAlchemy(app)

#-------------------------------------------------------------------



#----------------------------이미지 모델 -------------------------------------------
# 모델 위치
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "Bee_image_model.h5")
model = load_model(model_path)
print("Model loaded successfully.")

# 이미지 크기 설정 
IMG_SIZE = (224, 224)

#클래스 이름
class_names = ['old_feather', 'old_normal', 'old_ung', 'young_ascos', 'young_buzzer', 'young_normal', 'young_ung']
#-----------------------------------------------------------------------

# 키 불러오기
load_dotenv(dotenv_path="key.env")
openai_api_key = os.getenv('OPENAI_API_KEY', 'default_key_if_missing')


        
#---------------- mysql user table-----------------------------------
class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.String(30), primary_key=True, nullable=False)  # Primary key
    password = db.Column(db.String(255), nullable=False)                 # 비밀번호
    realname = db.Column(db.String(50), nullable=False)                  # 실제 이름
    address = db.Column(db.String(100), nullable=False)                  # 주소
    phone = db.Column(db.String(20), nullable=False)                     # 전화번호
    number = db.Column(db.Integer, unique=True, nullable=False, autoincrement=True)  # 고유한 번호 필드

    # 관계 설정
    posts = db.relationship('Posts', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comments', back_populates='user', cascade='all, delete-orphan')


class Posts(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.String(30), primary_key=True, nullable=False)  # Primary Key
    user_id = db.Column(db.String(30), db.ForeignKey('user.user_id'), nullable=False)  # 외래키
    title = db.Column(db.String(30), nullable=False)  # 제목
    text = db.Column(db.String(500), nullable=False)  # 게시물 내용
    imagepath = db.Column(db.String(300), nullable=False)  # 이미지 경로

    # 관계 설정
    user = db.relationship('User', back_populates='posts')  # user 테이블과의 관계
    comments = db.relationship('Comments', back_populates='post', cascade='all, delete-orphan')  # 댓글 관계


class Comments(db.Model):
    __tablename__ = 'comments'
    comments_id = db.Column(db.String(30), primary_key=True, nullable=False)  # Primary Key
    post_id = db.Column(db.String(30), db.ForeignKey('posts.post_id'), nullable=False)  # posts 테이블의 외래키
    user_id = db.Column(db.String(30), db.ForeignKey('user.user_id'), nullable=False)  # user 테이블의 외래키
    text = db.Column(db.String(500), nullable=False)  # 댓글 내용

    # 관계 설정
    post = db.relationship('Posts', back_populates='comments')  # posts 테이블과의 관계
    user = db.relationship('User', back_populates='comments')  # user 테이블과의 관계

#--------------------------------------------------------------------
    


# cors preflight 요청에 대한 응답
def _build_cors_prelight_response():
    response = jsonify({'message': 'CORS preflight'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000") #localhost3000에서만 서버 자원에 접근 가능
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")  #헤더: content-type
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS") #HTTP 메서드를 정의
    response.headers.add("Access-Control-Allow-Credentials", "true") #다른 도메인 에서 오는 요청도 인증 정보를 포함 허용(true)
    return response


# QA 체인 초기화
pdf_path = os.getenv('PDF_PATH', '꿀벌질병.pdf')  # 환경 변수로 PDF 경로 관리
qa_chain = create_qa_chain(pdf_path)


# 질문 처리 엔드포인트
@app.route('/ask', methods=['POST'])
def ask_question():
    query = request.json.get("query")
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    try:
        response = qa_chain(query)
        return jsonify({'response': str(response)})
    except Exception as e:
        return jsonify({'error': f'Error occurred: {str(e)}'}), 500






#------------------------------------------ 이미지 모델 ----------------------------
@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file:
        # 이미지를 모델에 넣을 수 있게 변환
        img = load_img(BytesIO(file.read()), target_size=IMG_SIZE)
        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img /= 255.0  # 이미지 정규화

        # 예측 실행 부분
        prediction = model.predict(img)
        predicted_class = np.argmax(prediction, axis=1)[0]
        predicted_class_name = class_names[predicted_class]

         # 디버깅용 출력
        print(f"Predicted class index: {predicted_class}")
        print(f"Predicted class name: {predicted_class_name}")

        # 결과 리턴 (JSON 형식)
        return jsonify({
            'predicted_class': int(predicted_class),
            'predicted_class_name': predicted_class_name
        })
    else:
        return jsonify({'error': 'Invalid file'}), 400

#-------------------------------- 여기 까지 -------------------------------------------

#------------------------------ 로그인 관련 기능---------------------------------------
# 회원가입
@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    # 요청 데이터 가져오기
    data = request.get_json()
    user_id = data.get('user_id')  # 수정: userid -> user_id
    password = data.get('password')
    realname = data.get('realname')
    address = data.get('address')
    phone = data.get('phone')

    # 필수 입력 값 확인
    if not all([user_id, password, realname, address, phone]):
        return jsonify({'message': '모든 필드를 입력해야 합니다.'}), 400

    # 비밀번호 해싱
    hashed_password = generate_password_hash(password)

    try:
        # 새로운 사용자 생성 및 데이터베이스에 추가
        new_user = User(
            user_id=user_id,  # 수정: userid -> user_id
            password=hashed_password,
            realname=realname,
            address=address,
            phone=phone
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")  # 디버깅용 출력
        return jsonify({'message': f'Error occurred while registering: {str(e)}'}), 500


# 로그인 처리
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    data = request.get_json()
    user_id = data.get('user_id')  # 수정: userid -> user_id
    password = data.get('password')

    try:
        # 사용자 데이터베이스에서 사용자 찾기
        user = User.query.filter_by(user_id=user_id).first() 

        if user and check_password_hash(user.password, password):
            session['user'] = user_id  # 수정: userid -> user_id
            return jsonify({'message': 'Login successful!', 'user': user_id}) 
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': 'Error occurred during login'}), 500


# 로그아웃 처리
@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    session.pop('user', None)  # 세션에서 사용자 정보 제거
    return jsonify({'message': 'Logout successful!'}), 200


# 접근 제한
@app.route('/api/login-check', methods=['GET'])
def imagemodel_api():
    if 'user' not in session:
        return jsonify({"error": "로그인 후 이용하세요", "logged_in": False}), 401

    return jsonify({"message": "정상적으로 로그인 되었습니다", "logged_in": True})

@app.route('/static/js/imagemodel.js', methods=['GET'])
def serve_js():
    try:
        with open('static/js/imagemodel.js', 'r') as js_file:
            content = js_file.read()
        return Response(content, mimetype='application/javascript')
    except FileNotFoundError:
        return jsonify({"error": "JavaScript 파일을 찾을 수 없습니다."}), 404
# ------------------------------------------------------------------------

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
