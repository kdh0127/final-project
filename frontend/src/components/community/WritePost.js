import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../style/WritePost.module.css";
import Header from "../Header";

const PostWrite = ({ setIsWriting }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("자유");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 로그인 상태 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        category,
        user_id: currentUser?.id, // user_id 전달
      }),
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
        <div className={styles.firstFormContainer}>
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
                value={currentUser?.realname || "로그인이 필요합니다"}
                disabled
                className={`${styles.metaInput} ${styles.metaInputDisabled}`}
              />
            </div>
          </div>
        </div>

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
