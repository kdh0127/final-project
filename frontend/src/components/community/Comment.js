import React, { useState, useEffect } from "react";
import styles from "../style/comment.module.css";

const Comment = ({ post_id }) => {
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력값

  // 댓글 데이터를 가져오는 함수
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${post_id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        alert("댓글을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  // 새 댓글 작성
  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("댓글을 입력하세요");
      return;
    }

    const newCommentData = {
      content: newComment,
      user_id: "익명",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch(`http://localhost:5000/posts/${post_id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommentData),
      });

      if (response.ok) {
        setComments([...comments, newCommentData]);
        setNewComment("");
      } else {
        alert("댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <span>댓글 [{comments.length}]</span>
      </div>

      {/* 댓글 리스트 */}
      {comments.map((comment, index) => (
        <div key={index} className={styles.comment}>
          <div className={styles.commentInfo}>
            <span className={styles.commentAuthor}>{comment.author}</span>
            <span className={styles.commentDate}>작성일: {comment.date}</span>
          </div>
          <div className={styles.commentContent}>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}

      {/* 댓글 작성 섹션 */}
      <div className={styles.commentForm}>
        <textarea
          placeholder="댓글을 작성하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className={styles.submitBtn} onClick={handleAddComment}>
          작성
        </button>
      </div>
    </div>
  );
};

export default Comment;
