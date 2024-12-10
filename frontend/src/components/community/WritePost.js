import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../style/WritePost.module.css";
import Header from "../Header";

const PostWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    category: "자유", // 기본값 설정
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 이동
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, text: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목과 내용 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const sanitizedContent = formData.text.replace(/<[^>]*>?/gm, "").trim();
    if (!sanitizedContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 포함
        body: JSON.stringify({
          title: formData.title,
          text: formData.text,
          category: formData.category,
          user_id: currentUser?.id, // 현재 로그인된 사용자 ID
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "게시물이 작성되었습니다.");
        navigate("/community"); // 게시판 조회 페이지로 이동
      } else {
        alert(result.message || "게시물 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setError("게시물 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <div className={styles.firstFormContainer}>
          <div className={styles.titleSection}>
            <label className={styles.labelBox}>제목</label>
            <input
              type="text"
              name='title'
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

            <div className={styles.metaBox}>
              <label className={styles.labelBox}>작성자</label>
              <input
                type="text"
                value={currentUser ? currentUser.user_id : ""}
                disabled
                placeholder="로그인이 필요합니다"
                className={`${styles.metaInput} ${styles.metaInputDisabled}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.secondFormContainer}>
          <ReactQuill
            value={formData.text}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "color",
              "background",
              "list",
              "bullet",
              "align",
              "link",
              "image",
            ]}
            className={`${styles.quillContainer}`}
          />
        </div>

        <div className={styles.submitSection}>
          <button type="submit" onClick={handleSubmit} className={styles.submitButton}>
            작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostWrite;
