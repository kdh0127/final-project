import React, { useState } from "react";
import Header from '../Header';
import styles from "../style/comment.module.css";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      alert("댓글을 입력하세요!");
      return;
    }

    const newCommentData = {
      author: "익명",
      date: new Date().toISOString().split("T")[0],
    };

    setComments([...comments, newCommentData]);
    setNewComment("");
  };

  return (
    <div>
      {/* 고정 헤더 */}
      <Header />

    <div className={styles.container}>
      {/* 제목 컨테이너 */}
      <div className={styles.titleContainer}>
        <div className={styles.titleLeft}>
          <button className={styles.categoryBtn}>구분</button>
          <span className={styles.title}>게시글 제목</span>
        </div>
        <div className={styles.titleRight}>
          <button className={styles.editBtn}>수정</button>
          <button className={styles.deleteBtn}>삭제</button>
        </div>
      </div>

      {/* 작성자 컨테이너 */}
      <div className={styles.authorContainer}>
      {/* 좌측: 작성자 */}
      <div className={styles.authorLeft}>
        <span>작성자: 홍길동</span>
      </div>

      {/* 우측: 조회수, 댓글수, 작성일 */}
        <div className={styles.authorRight}>
        <span>조회수: 123</span>
        <span>댓글수: {comments.length}</span>
        <span>작성일: 2024-12-06</span>
        </div>
      </div>

      {/* 내용 컨테이너 */}
      <div className={styles.postContent}>
        <p>여기에 게시글 내용이 들어갑니다...










          
        </p>
      </div>

      {/* 댓글 섹션 */}
      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <span>댓글 [{comments.length}]</span>
        </div>
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
      </div>

{/* 댓글 작성 컨테이너 */}
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
    </div>
  );
};

export default Comment;
