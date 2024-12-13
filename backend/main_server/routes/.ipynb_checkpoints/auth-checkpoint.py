from flask import Blueprint, request, jsonify, session, Response
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from models import db

auth_blueprint = Blueprint('auth', __name__)

# CORS preflight 처리 함수
def _build_cors_prelight_response():
    response = jsonify({'message': 'CORS preflight'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


# 회원가입
@auth_blueprint.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    realname = data.get('realname')
    address = data.get('address')
    phone = data.get('phone')

    # 필수 입력 값 확인
    if not all([user_id, password, realname, address, phone]):
        return jsonify({'message': '모든 필드를 입력해야 합니다.'}), 400

    hashed_password = generate_password_hash(password)

    try:
        new_user = User(
            user_id=user_id,
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
        return jsonify({'message': f'Error occurred while registering: {str(e)}'}), 500


# 로그인
@auth_blueprint.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')

    try:
        # 사용자 인증
        user = User.query.filter_by(user_id=user_id).first()
        if user and check_password_hash(user.password, password):
            session['user'] = user_id  # 세션에 사용자 ID 저장

            # 로그인 성공 시 실명(realname) 반환
            return jsonify({
                'message': 'Login successful!',
                'user': {
                    'user_id': user.user_id,
                    'realname': user.realname
                }
            }), 200

        return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': f'Error occurred during login: {str(e)}'}), 500


# 로그아웃
@auth_blueprint.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()

    session.pop('user', None)
    return jsonify({'message': 'Logout successful!'}), 200


# 로그인 확인
@auth_blueprint.route('/login-check', methods=['GET'])
def login_check():
    if 'user' not in session:
        return jsonify({"error": "로그인 후 이용하세요", "logged_in": False}), 401
    return jsonify({"message": "정상적으로 로그인 되었습니다", "logged_in": True})


# JavaScript 파일 제공
@auth_blueprint.route('/static/js/imagemodel.js', methods=['GET'])
def serve_js():
    try:
        with open('static/js/imagemodel.js', 'r') as js_file:
            content = js_file.read()
        return Response(content, mimetype='application/javascript')
    except FileNotFoundError:
        return jsonify({"error": "JavaScript 파일을 찾을 수 없습니다."}), 404
