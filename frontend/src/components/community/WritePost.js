import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../style/WritePost.module.css"; // CSS 모듈 임포트

const PostWrite = ({ setIsWriting }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, user_id: "testUser" }),
    })
      .then((response) => response.json())
      .then(() => {
        setIsWriting(false);
        alert("게시물이 작성되었습니다.");
      })
      .catch((error) => console.error("Error posting data:", error));
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "80%", margin: "20px auto" }}>
      {/* 제목 섹션 */}
      <div className={styles.section}>
        <label className={styles.labelBox}>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.inputBox}
        />
      </div>

      {/* 구분 및 작성자 섹션 */}
      <div className={styles.backgroundSection}>
        {/* 구분 섹션 */}
        <div className={`${styles.flexItem} ${styles.section}`}>
          <label className={styles.labelBox}>구분</label>
          <select name="category" required className={styles.inputBox}>
            <option value="자유">자유</option>
            <option value="질문">질문</option>
            <option value="정보">정보</option>
            <option value="모임">모임</option>
            <option value="FAQ">FAQ</option>
          </select>
        </div>

        {/* 작성자 섹션 */}
        <div className={`${styles.flexItem} ${styles.section}`} style={{ marginRight: "0" }}>
          <label className={styles.labelBox}>작성자</label>
          <input
            type="text"
            value="testUser"
            disabled
            className={`${styles.inputBox} ${styles.inputBoxDisabled}`}
          />
        </div>
      </div>

      {/* 내용 섹션 */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label style={{ display: "block", marginBottom: "8px" }}></label>
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
          className={styles.quillContainer}
        />

        {/* 작성 버튼 */}
        <button type="submit" className={styles.submitButton}>
          작성
        </button>
      </div>
    </form>
  );
};

export default PostWrite;
