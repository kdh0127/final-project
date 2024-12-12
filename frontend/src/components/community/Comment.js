import React, { useState, useEffect } from "react";
import styles from "../style/comment.module.css";

const Comment = ({ post_id }) => {
  const [currentUser] = useState({ user_id: "test_user" }); // 현재 로그인된 사용자 (예시)
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력값
  const [replyTarget, setReplyTarget] = useState(null); // 대댓글 작성 대상 댓글 ID
  const [replyText, setReplyText] = useState(""); // 대댓글 입력값

  // 댓글 데이터를 가져오는 함수
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      // } else {
      //   alert("댓글을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  // 새 댓글 작성
  const handleAddComment = async (text, parentCommentId = null) => {
    if (text.trim() === "") {
      alert("댓글을 입력하세요");
      return;
    }

    const newCommentData = {
      user_id: currentUser?.user_id,
      text,
      parent_comment_id: parentCommentId, // 대댓글 대상 댓글 ID (없으면 null)
    };

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentData),
        credentials: "include", // 세션 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        if (parentCommentId) {
          // 대댓글인 경우
          const updatedComments = comments.map((comment) => {
            if (comment.comment_id === parentCommentId) {
              return {
                ...comment,
                children: [...(comment.children || []), result],
              };
            }
            return comment;
          });
          setComments(updatedComments);
        } else {
          // 일반 댓글인 경우
          setComments([...comments, result]);
        }
        setNewComment("");
        setReplyText("");
        setReplyTarget(null); // 대댓글 작성 상태 초기화
      } else {
        alert("댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // 댓글과 대댓글을 렌더링하는 함수
  const renderComments = (comments, depth = 0) => {
    return comments.map((comment) => (
      <div key={comment.comment_id} style={{ marginLeft: `${depth * 20}px` }}>
        <div className={styles.comment}>
          <div className={styles.commentInfo}>
            <span className={styles.commentUser}>{comment.user_id}</span>
            <span className={styles.commentDate}>작성일: {comment.created_at}</span>
          </div>
          <div className={styles.commentContent}>
            <p>{comment.text}</p>
          </div>
          {/* 대댓글 작성 버튼 */}
          <button
            className={styles.replyBtn}
            onClick={() => setReplyTarget(comment.comment_id)}
          >
            답글
          </button>
        </div>
        {/* 대댓글 작성 창 */}
        {replyTarget === comment.comment_id && (
          <div className={styles.replyForm}>
            <textarea
              placeholder="대댓글을 작성하세요..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              className={styles.submitBtn}
              onClick={() => handleAddComment(replyText, comment.comment_id)}
            >
              작성
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setReplyTarget(null)}
            >
              취소
            </button>
          </div>
        )}
        {/* 대댓글 렌더링 */}
        {comment.children && renderComments(comment.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <span>댓글 [{comments.length}]</span>
      </div>

      {/* 댓글 리스트 */}
      {renderComments(comments)}

      {/* 댓글 작성 섹션 */}
      <div className={styles.commentForm}>
        <textarea
          placeholder="댓글을 작성하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className={styles.submitBtn}
          onClick={() => handleAddComment(newComment)}
        >
          작성
        </button>
      </div>
    </div>
  );
};

export default Comment;
