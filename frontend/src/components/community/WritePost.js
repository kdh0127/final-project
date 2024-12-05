import React, { useState, useEffect } from "react"; // useEffect import 추가
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../style/WritePost.module.css"; // CSS 모듈 임포트
import Header from "../Header";

const PostWrite = ({ setIsWriting, currentUser }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("자유");
  const [error, setError] = useState(null);

  useEffect(() => {
    const qlEditor = document.querySelector(".ql-editor.ql-blank");
    if (qlEditor) {
      qlEditor.classList.remove("ql-blank"); // 'ql-blank' 클래스 제거
      qlEditor.style.background = "transparent"; // 배경색 수정
    }
  }, [content]); // content가 변경될 때마다 실행하도록 의존성 추가

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category, user_id: currentUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("게시물 작성 중 오류가 발생했습니다.");
        }
        return response.json();
      })
      .then(() => {
        setIsWriting(false);
        alert("게시물이 작성되었습니다.");
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        setError("게시물 작성 중 문제가 발생했습니다.");
      });
  };

  return (
    <div>
      <Header />

      <div className={styles.container}>
        {/* 첫 번째 폼 컨테이너 */}
        <div className={styles.firstFormContainer}>
          {/* 제목 섹션 */}
          <div className={styles.titleSection}>
            <label className={styles.labelBox}>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={currentUser}
                disabled
                className={`${styles.metaInput} ${styles.metaInputDisabled}`}
              />
            </div>
          </div>
        </div>

        {/* 두 번째 폼 컨테이너 */}
        <div className={styles.secondFormContainer}>
          <ReactQuill
            value={content}
            onChange={setContent}
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

        {/* 작성 버튼 */}
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
