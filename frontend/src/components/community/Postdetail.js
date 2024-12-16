import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../Header";
import Comment from "./Comment";
import styles from "../style/comment.module.css";

const PostDetail = () => {
  const { post_id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [plainTextContent, setPlainTextContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "자유",
    content: "",
  });

  useEffect(() => {
    fetchCurrentUser();
    increaseViewsAndFetchPost();
  }, [post_id]);

  const fetchCurrentUser = () => {
    axios
      .get("http://localhost:5000/api/login-check", { withCredentials: true })
      .then((response) => {
        console.log("현재 사용자 ID:", response.data.user_id);
        setCurrentUser(response.data.user_id);
      })
      .catch((error) => {
        console.error("로그인 확인 실패:", error.response?.data || error.message);
        alert("로그인 후 이용 가능합니다.");
        navigate("/login");
      });
  };

  const increaseViewsAndFetchPost = () => {
    axios
      .post(`http://localhost:5000/api/posts/${post_id}/increase-views`)
      .then((response) => {
        const data = response.data.post;
        setPost(data);
        setFormData({
          title: data.title || "",
          category: data.category || "자유",
          content: data.content || "",
        });
        setPlainTextContent(stripHTML(data.content));
      })
      .catch((error) => {
        console.error("조회수 증가 및 게시글 데이터 불러오기 실패:", error.response?.data || error.message);
        alert("게시글을 불러오는데 실패했습니다.");
      });
  };

  const stripHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html || "";
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/posts/${post_id}`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert("게시글이 수정되었습니다.");
        setIsEditMode(false);
        increaseViewsAndFetchPost();
      })
      .catch((error) => {
        console.error("게시글 수정 실패:", error.response?.data || error.message);
        alert("게시글 수정에 실패했습니다.");
      });
  };

  const handleDelete = () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    axios
      .delete(`http://localhost:5000/api/posts/${post_id}`)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        navigate("/community");
      })
      .catch((error) => {
        console.error("게시글 삭제 실패:", error.response?.data || error.message);
        alert("게시글 삭제에 실패했습니다.");
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const isAuthor = currentUser && String(currentUser) === String(post?.user_id);

  if (!post) return <div>게시글을 불러오는 중입니다...</div>;

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
              {isAuthor && (
                <div className={styles.titleRight}>
                  <button className={styles.editBtn} onClick={() => setIsEditMode(true)}>
                    수정
                  </button>
                  <button className={styles.deleteBtn} onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              )}
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
        )}
      </div>
    </div>
  );
};

export default PostDetail;
