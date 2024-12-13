from flask import Blueprint, request, jsonify, session
from models.comments import Comments
from models import db

comment_blueprint = Blueprint('comment', __name__)

# 댓글 작성 API
@comment_blueprint.route('/posts/<int:post_id>/comments', methods=['POST', 'OPTIONS'])
def create_comment(post_id):
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight'}), 200

    if 'user' not in session:
        return jsonify({'message': '로그인 후 이용하세요'}), 401

    data = request.get_json()
    text = data.get('text')

    # 필수 입력 값 확인
    if not text:
        return jsonify({'message': '댓글 내용을 입력해주세요'}), 400

    parent_comment_id = data.get('parent_comment_id')
    if parent_comment_id:
        parent_comment = Comments.query.get(parent_comment_id)
        if not parent_comment:
            return jsonify({'message': 'Invalid parent_comment_id'}), 400

    try:
        # 댓글 생성
        new_comment = Comments(
            post_id=post_id,
            user_id=session['user'],  # 현재 로그인된 사용자 ID 사용
            text=text,
            parent_comment_id=parent_comment_id
        )
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({'message': 'Comment created successfully', 
                        'comment_id': new_comment.comment_id,
                        'user_id': new_comment.user_id,
                        'date':new_comment.created_at.strftime('%Y-%m-%d'),  # 댓글 작성일
                        'parent_comment_id': new_comment.parent_comment_id
                        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'댓글 작성 중 오류 발생: {str(e)}'}), 500


@comment_blueprint.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    try:
        # 게시글에 달린 모든 댓글 조회
        comments = Comments.query.filter_by(post_id=post_id).all()
        if not comments:
            return jsonify({'message': f"No comments found for post_id {post_id}"}), 404

        # 댓글 직렬화 함수
        def serialize_comment(comment):
            return {
                'comment_id': comment.comment_id,
                'post_id': comment.post_id,
                'user_id': comment.user_id,
                'text': comment.text,
                'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'parent_comment_id': comment.parent_comment_id,
                'children': [serialize_comment(child) for child in comment.children]  # 대댓글 직렬화
            }

        # 부모 댓글만 직렬화 (대댓글은 children에서 처리)
        serialized_comments = [serialize_comment(comment) for comment in comments if comment.parent_comment_id is None]

        return jsonify(serialized_comments), 200
    except Exception as e:
        return jsonify({'error': f"Error retrieving comments: {str(e)}"}), 400
