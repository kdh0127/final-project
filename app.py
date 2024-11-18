import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from qa_model import create_qa_chain
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv(dotenv_path="key.env")
openai_api_key = os.getenv('OPENAI_API_KEY', 'default_key_if_missing')

# Flask 애플리케이션 설정
app = Flask(__name__, static_url_path='', static_folder='uploads')
app.config['UPLOAD_FOLDER'] = 'uploads'

# 데이터베이스 바인딩 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'

app.config['SQLALCHEMY_BINDS'] = {
    'requests': 'sqlite:///requests.db',
    'processed': 'sqlite:///processed_requests.db'
}

db = SQLAlchemy(app)

migrate = Migrate(app, db)

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
    scheduled_date = db.Column(db.DateTime, nullable=True)  # 진료 날짜 필드 추가
    scheduled_time = db.Column(db.String(20), nullable=True)  # 진료 시간 필드 추가

    def __repr__(self):
        return f"<ProcessedRequest {self.name}>"

CORS(app)  # 필요시 특정 출처로 제한 가능

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
    
    # 진료 일정과 시간 저장
    scheduled_date = request.form.get('scheduled_date')  # 진료 날짜
    scheduled_time = request.form.get('scheduled_time')  # 진료 시간
    
    # 진료 날짜와 시간을 DB에 반영
    processed_request = ProcessedRequest(
        name=request_data.name,
        address=request_data.address,
        phone=request_data.phone,
        symptom_description=request_data.symptom_description,
        symptom_image=request_data.symptom_image,
        status=status,
        scheduled_date=scheduled_date,
        scheduled_time=scheduled_time
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

# 진료 일정 조회 엔드포인트
@app.route('/api/vet_schedule', methods=['GET'])
def get_vet_schedule():
    processed_requests = ProcessedRequest.query.filter_by(status='승낙').all()
    schedule_data = []
    
    for req in processed_requests:
        # 날짜와 시간을 ISO 형식으로 변환
        scheduled_datetime_str = None
        if req.scheduled_date:
            scheduled_datetime = req.scheduled_date
            scheduled_datetime_str = scheduled_datetime.isoformat()  # ISO 8601 형식으로 변환
            
            # 만약 시간이 있다면, 날짜와 시간 결합
            if req.scheduled_time:
                scheduled_datetime_str = f"{scheduled_datetime_str.split('T')[0]}T{req.scheduled_time}:00"
        
        # 데이터가 없으면 빈 문자열로 대체하거나 다른 기본값 처리
        schedule_data.append({
            'name': req.name,
            'date': scheduled_datetime_str or "",  # scheduled_datetime_str이 None일 경우 빈 문자열 처리
            'time': req.scheduled_time or "",  # scheduled_time이 없으면 빈 문자열 처리
        })
    
    return jsonify(schedule_data), 200

@app.route('/api/beekeeper_requests/<string:name>', methods=['GET'])
def get_beekeeper_requests(name):
    requests = ProcessedRequest.query.filter_by(name=name).all()
    return jsonify([{
        'id': req.id,
        'name': req.name,
        'status': req.status,  # 요청 상태 (승낙/거부)
        'symptom_description': req.symptom_description,
    } for req in requests]), 200

if __name__ == '__main__':
    app.run(debug=True)
