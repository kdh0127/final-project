import os
from flask import Flask, request, jsonify, send_from_directory 
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from qa_model import create_qa_chain
from dotenv import load_dotenv

load_dotenv(dotenv_path="key.env")
openai_api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__, static_url_path='', static_folder='uploads')
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

# SQLite 데이터베이스 URI 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///requests.db'  # 데이터베이스 파일이 프로젝트 디렉토리에 생성됨
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 성능을 위해 설정

# SQLAlchemy 객체 초기화
db = SQLAlchemy(app)

# 요청 데이터 모델 정의
class RequestData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    symptom_description = db.Column(db.Text, nullable=False)
    symptom_image = db.Column(db.String(200), nullable=True)  # 이미지 경로 저장

    def __repr__(self):
        return f"<Request {self.name}>"

with app.app_context():
    db.create_all()
    


# PDF 파일 경로 및 QA 체인 설정
pdf_path = r'꿀벌질병.pdf'  # PDF 파일 경로
qa_chain = create_qa_chain(pdf_path)

@app.route('/api/request', methods=['POST'])
def create_request():
    name = request.form.get('name')
    address = request.form.get('address')
    phone = request.form.get('phone')
    symptom_description = request.form.get('symptom_description')
    symptom_image = request.files.get('symptom_image')  # 파일을 `request.files`에서 가져옴

    if symptom_image:
        image_path = f'uploads/{symptom_image.filename}'  # 예시 파일 경로 설정
        symptom_image.save(image_path)  # 서버에 이미지 파일 저장

        new_request = RequestData(
            name=name,
            address=address,
            phone=phone,
            symptom_description=symptom_description,
            symptom_image=image_path
        )
    else:
        new_request = RequestData(
            name=name,
            address=address,
            phone=phone,
            symptom_description=symptom_description
        )
    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Request created successfully'}), 201

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')  # 기본값 'uploads' 지정
    return send_from_directory(upload_folder, filename)

@app.route('/api/request', methods=['GET'])
def get_requests():
    # 모든 요청 데이터 가져오기
    requests = RequestData.query.all()
    
    # 요청 데이터 리스트 생성
    request_list = []
    for request in requests:
        print(request.symptom_image)
        request_list.append({
            'id': request.id,
            'name': request.name,
            'address': request.address,
            'phone': request.phone,
            'symptom_description': request.symptom_description,
            'symptom_image': request.symptom_image
        })

    return jsonify(request_list), 200

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

if __name__ == '__main__':
    app.run(debug=True)
