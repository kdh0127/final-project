from flask import Blueprint, request, jsonify, session
from models.posts import Posts
from models import db

post_blueprint = Blueprint('post', __name__)

# 게시글 작성
@post_blueprint.route('/create', methods=['POST', 'OPTIONS'])
def create_post():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight'}), 200

    if 'user' not in session:
        return jsonify({'message': '로그인 후 이용하세요'}), 401

    data = request.get_json()
    title = data.get('title')
    content = data.get('text')

    # 필수 입력 값 확인
    if not title or not content:
        return jsonify({'message': '제목과 내용을 입력해주세요'}), 400

    try:
        # 데이터베이스에 게시글 저장
        new_post = Posts(
            title=title,
            text=content,
            user_id=session['user'],  # 현재 로그인된 사용자 ID 사용
            category=data.get('category', '자유'),  # 기본값으로 '자유' 설정
            imagepath=data.get('imagepath')  # 이미지 경로가 있을 경우 포함
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': '게시글이 성공적으로 등록되었습니다!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'게시글 등록 중 오류 발생: {str(e)}'}), 500


# 게시글 목록 조회
@post_blueprint.route('/posts', methods=['GET'])
def list_posts():
    try:
        category = request.args.get('category')  # 쿼리 파라미터에서 category 값 가져오기
        search = request.args.get('search')  # 쿼리 파라미터에서 검색어 가져오기

        # 기본 쿼리 생성
        query = Posts.query

        # 카테고리 필터링
        if category:
            query = query.filter_by(category=category)

        # 검색어 필터링
        if search:
            query = query.filter(
                Posts.title.contains(search) | Posts.content.contains(search)
            )

        # 정렬 및 실행
        posts = query.order_by(Posts.created_at.desc()).all()

        # 응답 데이터 생성
        post_list = [
            {
                'post_id': post.post_id,
                'title': post.title,
                'content': post.text,
                'user_id': post.user_id,
                'category': post.category,
                'created_at': post.created_at.isoformat(),
                'views': 0  # 조회수를 DB에 추가하지 않았다면 기본값 0
            }
            for post in posts
        ]
  
        return jsonify(post_list), 200

    except Exception as e:
        return jsonify({'message': f'게시글 조회 중 오류 발생: {str(e)}'}), 500


# 게시글 상세 조회
@post_blueprint.route('posts/<int:post_id>', methods=['GET'])
def detail_post(post_id):
    try:
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({'message': '게시글을 찾을 수 없습니다.'}), 404

        return jsonify({
            'post_id': post.post_id,
            'title': post.title,
            'content': post.text,
            'user_id': post.user_id,
            'category': post.category,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }), 200
    except Exception as e:
        return jsonify({'message': f'게시글 조회 중 오류 발생: {str(e)}'}), 500
