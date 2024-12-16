import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트
import style from "../style/BoardList.module.css";
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function BoardList() {
  const sections = ["자유", "질문", "정보", "모임"];
  const searchTypes = ["제목", "내용", "작성자"]; // 검색 유형 추가
  const [selectedSection, setSelectedSection] = useState("전체");
  const [selectedSearchType, setSelectedSearchType] = useState("제목"); // 검색 유형 상태 추가
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]); // 게시글 데이터
  
  // 서버에서 데이터 가져오기
  const fetchPosts = async (category = "전체", searchType = "제목", query = "") => {
    try {
      // 기본 URL 설정
      let url = "http://localhost:5000/api/posts";
      const params = new URLSearchParams();

      // 카테고리 필터 추가
      if (category !== "전체") {
        params.append("category", category);
      }

      // 검색 유형과 검색어 필터 추가
      if (query.trim() !== "") {
        params.append("searchType", searchType); // 검색 유형
        params.append("search", query); // 검색어
      }

      // 쿼리 파라미터를 URL에 추가
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("API 요청 URL:", url); // 요청 URL 확인
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const increaseViewCount = async (post_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post_id}/increase-views`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("조회수 증가 요청 실패");
      }
    } catch (error) {
      console.error("조회수 증가 실패:", error.message);
    }
  };

  // 드롭다운 선택 시 데이터 다시 가져오기
  useEffect(() => {
    fetchPosts(selectedSection);
  }, [selectedSection]);

  // 검색 버튼 클릭 시 데이터 요청
  const handleSearch = () => {
    fetchPosts(selectedSection, selectedSearchType, searchQuery);
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
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className={style.sectionDropdown}
            >
              <option>전체</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>

            {/* 검색 유형 드롭다운 */}
            <select
              value={selectedSearchType}
              onChange={(e) => setSelectedSearchType(e.target.value)}
              className={style.searchTypeDropdown} // 스타일 클래스 추가
            >
              {searchTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
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
              <FontAwesomeIcon icon={faMagnifyingGlass} />
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
                      <Link
                        to={`/board/${post.post_id}`}
                          className={style.link}
                          onClick={async (e) => {
                          e.preventDefault(); // 기본 페이지 이동 동작 방지
                      try {
                        await increaseViewCount(post.post_id); // 조회수 증가 API 호출
                        const updatedPosts = await fetchPosts(selectedSection); // 데이터 새로고침
                        
                        window.location.href = `/board/${post.post_id}`; // 게시글 상세 페이지로 이동
                        } catch (error) {
                          console.error("조회수 증가 중 오류:", error.message);
                        }
                         }}
                        >
                          {post.title}
                      </Link>
                    </td>
                    {/* 제목 */}
                    <td>{post.user_id}</td> {/* 작성자 */}
                    <td>{new Date(post.created_at).toLocaleDateString()}</td> {/* 작성일 */}
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
