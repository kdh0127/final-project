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
        search_type = request.args.get('searchType', '제목')  # 검색 유형 파라미터 기본값: 제목

        # 기본 쿼리 생성
        query = Posts.query

        # 카테고리 필터링
        if category:
            query = query.filter_by(category=category)

        # 검색어 필터링
        if search and search.strip():
            search = search.strip()
            if search_type == "제목":
                query = query.filter(Posts.title.contains(search))
            elif search_type == "내용":
                query = query.filter(Posts.text.contains(search))
            elif search_type == "작성자":
                query = query.filter(Posts.user_id.contains(search))
            else:
                return jsonify({'message': '잘못된 검색 유형입니다'}), 400

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
                'views': post.views  # 조회수를 DB에 추가하지 않았다면 기본값 0
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

# 게시글 수정
@post_blueprint.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.json  # 클라이언트에서 JSON 데이터 받기
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    # 수정할 게시글 찾기
    post = Posts.query.filter_by(post_id=post_id).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    # 제목, 내용, 카테고리 업데이트
    title = data.get('title')
    text = data.get('content')
    category = data.get('category')

    print(f"Received data: title={title}, text={text}, category={category}")  # 디버깅용 로그

    if title is not None:
        post.title = title.strip()
    if text is not None:  # 빈 문자열도 허용
        post.text = text.strip()
    if category is not None:
        post.category = category.strip()

    print(f"Before commit: post.text={post.text}, post.title={post.title}, post.category={post.category}")  # 확인용 로그

    # 버전 증가
    post.version += 1

    try:
        db.session.commit()
        print(f"Post updated: post_id={post.post_id}, title={post.title}, text={post.text}, category={post.category}")
        return jsonify({
            'message': 'Post updated successfully',
            'post': {
                'post_id': post.post_id,
                'title': post.title,
                'content': post.text,
                'category': post.category,
                'version': post.version,
                'updated_at': post.updated_at
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating post: {e}")
        return jsonify({'error': 'Failed to update post', 'details': str(e)}), 500

# 게시글 삭제
@post_blueprint.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    
    # 삭제할 게시글 찾기
    post = Posts.query.filter_by(post_id=post_id).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    try:
        # 게시글 삭제
        db.session.delete(post)
        db.session.commit()
        print(f"Post deleted: post_id={post_id}")  # 디버깅용 로그
        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting post: {e}")  # 에러 로그
        return jsonify({'error': 'Failed to delete post', 'details': str(e)}), 500

# 조회수 증가 API
@post_blueprint.route('/posts/<int:post_id>/increase-views', methods=['POST'])
def increase_views(post_id):
    try:
        post = Posts.query.get(post_id)
        if not post:
            return jsonify({'message': '게시글을 찾을 수 없습니다.'}), 404

        # 조회수 증가
        post.views += 1
        db.session.commit()

        # 필요한 데이터를 클라이언트에 반환
        return jsonify({
            'message': '조회수가 증가되었습니다.',
            'post': {
                'post_id': post.post_id,
                'title': post.title,
                'content': post.text,
                'user_id': post.user_id,
                'category': post.category,
                'created_at': post.created_at.isoformat(),
                'views': post.views
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'조회수 증가 중 오류 발생: {str(e)}'}), 500

