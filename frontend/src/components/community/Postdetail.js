import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header"; // 헤더 컴포넌트
import Comment from "./Comment"; // 댓글 컴포넌트
import styles from "../style/comment.module.css";

const PostDetail = () => {
  const { post_id } = useParams(); // URL에서 post_id를 가져오기
  const [post, setPost] = useState(); // 게시글 데이터
  const [plainTextContent, setPlainTextContent] = useState(""); // HTML 태그 제거된 내용
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태

  const [formData, setFormData] = useState({
    title: "",
    category: "자유", // 기본값 설정
    content: "",
  });

  // 게시글 데이터를 가져오는 함수
  const fetchPostData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setFormData({
          title: data.title || "",
          category: data.category || "자유",
          content: data.content || "",
        });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    console.log("Sending formData:", formData); // 디버깅용
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("게시글이 수정되었습니다.");
        setIsEditMode(false);
        fetchPostData();
      } else {
        alert("게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
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
      <Header />

      <div className={styles.container}>
        {!isEditMode ? (
          <>
            <div className={styles.titleContainer}>
              <div className={styles.titleLeft}>
                <button className={styles.categoryBtn}>{post.category || "카테고리"}</button>
                <span className={styles.title}>{post.title || "게시글 제목"}</span>
              </div>
              <div className={styles.titleRight}>
                <button className={styles.editBtn} onClick={() => setIsEditMode(true)}>
                  수정
                </button>
                <button className={styles.deleteBtn}>삭제</button>
              </div>
            </div>

            <div className={styles.authorContainer}>
              <div className={styles.authorLeft}>
                <span>작성자: {post.user_id || "익명"}</span>
              </div>
              <div className={styles.authorRight}>
                <span>조회수: {post.views || 0}</span>
                <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.postContent}>{plainTextContent}</div>

            <div className={styles.commentsSection}>
              <Comment post_id={post_id} />
            </div>
          </>
        ) : (
          <div className={styles.editContainer}>
            <div className={styles.container}>
              <div className={styles.firstFormContainer}>
                <div className={styles.titleSection}>
                  <label className={styles.labelBox}>제목</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={styles.titleInput}
                  />
                </div>
                <div className={styles.divider}></div>

                <div className={styles.metaSection}>
                  <div className={styles.metaBox}>
                    <label className={styles.labelBox}>구분</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={styles.metaInput}
                    >
                      <option value="자유">자유</option>
                      <option value="질문">질문</option>
                      <option value="정보">정보</option>
                      <option value="모임">모임</option>
                      <option value="FAQ">FAQ</option>
                    </select>
                  </div>

                  <ReactQuill
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    className={styles.editor}
                  />
                  <div className={styles.buttonGroup}>
                    <button className={styles.saveBtn} onClick={handleSave}>
                      저장
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setIsEditMode(false)}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
