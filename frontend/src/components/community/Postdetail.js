import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header"; // 헤더 컴포넌트
import Comment from "./Comment"; // 댓글 컴포넌트
import styles from "../style/comment.module.css";

const PostDetail = () => {
  const { post_id } = useParams('http://localhost:3000/board/${post_id}'); // URL에서 post_id를 가져오기
  const [post, setPost] = useState(); // 게시글 데이터
  const [plainTextContent, setPlainTextContent] = useState(""); // HTML 태그 제거된 내용

  // 게시글 데이터를 가져오는 함수
  const fetchPostData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        // ReactQuill로 HTML 태그 제거
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data.content || "";
        setPlainTextContent(tempDiv.textContent || tempDiv.innerText || "");
      } else {
        alert("게시글을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [post_id]);

  if (!post) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  return (
    <div>
      {/* 고정 헤더 */}
      <Header />

      {/* 게시글 상세 정보 */}
      <div className={styles.container}>
        {/* 제목 섹션 */}
        <div className={styles.titleContainer}>
          <div className={styles.titleLeft}>
            <button className={styles.categoryBtn}>{post.category || "카테고리"}</button>
            <span className={styles.title}>{post.title || "게시글 제목"}</span>
          </div>
          <div className={styles.titleRight}>
            <button className={styles.editBtn}>수정</button>
            <button className={styles.deleteBtn}>삭제</button>
          </div>
        </div>

        {/* 작성자 및 기타 정보 */}
        <div className={styles.authorContainer}>
          <div className={styles.authorLeft}>
            <span>작성자: {post.user_id || "익명"}</span>
          </div>
          <div className={styles.authorRight}>
            <span>조회수: {post.views || 0}</span>
            <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className={styles.postContent}>
          {plainTextContent}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className={styles.commentsSection}>
        <Comment post_id={post_id} />
      </div>
    </div>
  );
};

export default PostDetail;
