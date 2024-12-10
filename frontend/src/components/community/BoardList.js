import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트
import style from "../style/BoardList.module.css";
import Header from '../Header';

function BoardList() {
  const sections = ["자유", "질문", "정보", "모임"];
  const [selectedSection, setSelectedSection] = useState("구분");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]); // 게시글 데이터
  
  // 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url =
          selectedSection === "구분"
            ? "http://localhost:5000/api/posts" // 전체 게시글
            : `http://localhost:5000/api/posts?category=${selectedSection}`; // 특정 카테고리 게시글
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedSection]);

  const handleSearch = () => {
    alert(`검색: ${searchQuery}, 선택된 구분: ${selectedSection}`);
    // 실제 검색 로직 추가
  };

  return (
    <div>
      {/* 고정 헤더 */}
      <Header />

     {/* 메인 컨테이너 */}
     <div className={style.container}>
        {/* 검색 및 글쓰기 버튼을 포함하는 박스 */}
        <div className={style.buttonBox}>
          {/* 왼쪽 영역: 검색 */}
          <div className={style.searchContainer}>
        {/* 구분 드롭다운 */}
        <select value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className={style.sectionDropdown}
        >
             <option disabled>구분</option>
          {sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>

        {/* 검색 입력 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className={style.searchInput}
        />

        {/* 검색 버튼 */}
        <button onClick={handleSearch} className={style.searchButton}>

        </button>
      </div>

      {/* 오른쪽 영역: 글쓰기 버튼 */}
      <div className={style.writeContainer}>
        <Link to="/board/write" className={style.writeButton}>
          글쓰기
          </Link>
          </div>
        </div>

        {/* 게시글 테이블 */}
        <div className={style.tableBox}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post.post_id}>
                  <td>{index + 1}</td> {/* 번호 */}
                  <td>{post.category}</td> {/* 구분 */}
                  <td>
                    <Link to={`/board/${post.post_id}`} className={style.link}>
                      {post.title}
                    </Link>
                  </td> {/* 제목 */}
                  <td>{post.user_id}</td> {/* 작성자 */}
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>{" "}
                  {/* 작성일 */}
                  <td>{post.views}</td> {/* 조회수 */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">게시글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        </div>
        </div>
      );
}


export default BoardList;