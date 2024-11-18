import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from qa_model import create_qa_chain
from dotenv import load_dotenv

#---------------------------------------------
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
from io import BytesIO
#---------------------------------------------



#-----------------------cors 설정-----------------------------------
# Flask 애플리케이션 설정
app = Flask(__name__, static_url_path='', static_folder='uploads')
app.config['UPLOAD_FOLDER'] = 'uploads'

CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


# cors preflight 요청에 대한 응답
def _build_cors_prelight_response():
    response = jsonify({'message': 'CORS preflight'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000") #localhost3000에서만 서버 자원에 접근 가능
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")  #헤더: content-type
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS") #HTTP 메서드를 정의
    response.headers.add("Access-Control-Allow-Credentials", "true") #다른 도메인 에서 오는 요청도 인증 정보를 포함 허용(true)
    return response

#-------------------------------------------------------------------------

#----------------------------이미지 모델 -------------------------------------------
# 모델 위치
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "Bee_image_model.h5")

# 이미지 크기 설정 
IMG_SIZE = (224, 224)

#클래스 이름
class_names = ['old_feather', 'old_normal', 'old_ung', 'young_ascos', 'young_buzzer', 'young_normal', 'young_ung']
#-----------------------------------------------------------------------

# 환경 변수 로드
load_dotenv(dotenv_path="key.env")
openai_api_key = os.getenv('OPENAI_API_KEY', 'default_key_if_missing')



# 데이터베이스 URI 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'
app.config['SQLALCHEMY_BINDS'] = {
    'requests': 'sqlite:///request.db',
    'processed': 'sqlite:///processed_requests.db'
}

db = SQLAlchemy(app)

SQLALCHEMY_BINDS = {
    'requests': 'sqlite:///requests.db',
    'processed': 'sqlite:///processed.db'
}
# 요청 데이터 모델
class RequestData(db.Model):
    __bind_key__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    symptom_description = db.Column(db.Text, nullable=False)
    symptom_image = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f"<Request {self.name}>"
    

class ProcessedRequest(db.Model):
    __bind_key__ = 'processed'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    symptom_description = db.Column(db.Text, nullable=False)
    symptom_image = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(20), nullable=False)

def __repr__(self):
    return f"<ProcessedRequest {self.name}>"





# 테이블 생성 코드
with app.app_context():
    db.create_all() 

# QA 체인 초기화
pdf_path = os.getenv('PDF_PATH', '꿀벌질병.pdf')  # 환경 변수로 PDF 경로 관리
qa_chain = create_qa_chain(pdf_path)

# 요청 생성 엔드포인트
@app.route('/api/request', methods=['POST'])
def create_request():
    name = request.form.get('name')
    address = request.form.get('address')
    phone = request.form.get('phone')
    symptom_description = request.form.get('symptom_description')
    symptom_image = request.files.get('symptom_image')

    # 입력 유효성 검증
    if not all([name, address, phone, symptom_description]):
        return jsonify({'error': '모든 필드를 입력하세요'}), 400

    # 파일 저장
    image_path = None
    if symptom_image:
        if symptom_image.filename.split('.')[-1].lower() not in {'jpg', 'jpeg', 'png'}:
            return jsonify({'error': '허용되지 않은 파일 형식입니다'}), 400
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], symptom_image.filename)
        symptom_image.save(image_path)

    new_request = RequestData(
        name=name,
        address=address,
        phone=phone,
        symptom_description=symptom_description,
        symptom_image=image_path
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Request created successfully'}), 201

# 업로드된 파일 제공 엔드포인트
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 요청 목록 조회 엔드포인트
@app.route('/api/request', methods=['GET'])
def get_requests():
    requests = RequestData.query.all()
    return jsonify([{
        'id': req.id,
        'name': req.name,
        'address': req.address,
        'phone': req.phone,
        'symptom_description': req.symptom_description,
        'symptom_image': req.symptom_image
    } for req in requests]), 200

# 요청 상태 변경 (승낙/거부) 엔드포인트
@app.route('/api/request/<int:id>/<string:action>', methods=['PUT'])
def update_request_status(id, action):
    request_data = RequestData.query.get(id)
    if not request_data:
        return jsonify({'error': 'Request not found'}), 404

    if action not in {'approve', 'reject'}:
        return jsonify({'error': 'Invalid action'}), 400

    status = '승낙' if action == 'approve' else '거부'
    processed_request = ProcessedRequest(
        name=request_data.name,
        address=request_data.address,
        phone=request_data.phone,
        symptom_description=request_data.symptom_description,
        symptom_image=request_data.symptom_image,
        status=status
    )
    db.session.add(processed_request)
    db.session.delete(request_data)
    db.session.commit()
    return jsonify({'message': f'Request {id} {status} 완료 및 처리된 요청에 추가됨'}), 200

# 처리된 요청 조회 엔드포인트
@app.route('/api/processed', methods=['GET'])
def get_processed_requests():
    processed_requests = ProcessedRequest.query.all()
    return jsonify([{
        'id': req.id,
        'name': req.name,
        'address': req.address,
        'phone': req.phone,
        'symptom_description': req.symptom_description,
        'symptom_image': req.symptom_image,
        'status': req.status
    } for req in processed_requests]), 200

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

# 요청 삭제 엔드포인트
@app.route('/api/request/<int:id>', methods=['DELETE'])
def delete_request(id):
    request_data = RequestData.query.get(id)
    if not request_data:
        return jsonify({'error': 'Request not found'}), 404
    db.session.delete(request_data)
    db.session.commit()
    return jsonify({'message': f'Request {id} deleted successfully'}), 200


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

if __name__ == '__main__':
    app.run(debug=True)
