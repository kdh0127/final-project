import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageModel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionIndex, setPredictionIndex] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [error, setError] = useState(null); // 에러 메시지
  
  // Axios에서 세션 쿠키를 전달할 수 있도록 설정
  axios.defaults.withCredentials = true;

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/login-check', {
          withCredentials: true, // 세션 쿠키 전달
        });
        setIsLoggedIn(response.data.logged_in); // Flask에서 반환된 로그인 상태
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false); // 로그인 실패
      }
    };
    checkLoginStatus();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 로그인하지 않은 경우 업로드 제한
    if (!isLoggedIn) {
      setError("로그인 후 이용 가능합니다.");
      return;
    }

    setError(null); // 이전 에러 초기화
    setLoading(true); // 로딩 상태 시작

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // 세션 쿠키 전달
      });
      console.log("Server response:", response.data);
      setPrediction(response.data.predicted_class_name);
      setPredictionIndex(response.data.predicted_class);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        setError(`서버 오류: ${error.response.data}`);
      } else {
        setError("파일 업로드 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div>
      <h1>진단하고자 하는 사진을 넣어주세요</h1>

      {/* 로그인 상태 확인 */}
      {!isLoggedIn ? (
        <p style={{ color: 'red' }}>로그인 후 이용 가능합니다.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={loading || !selectedFile}>
            {loading ? '업로드 중...' : '업로드 및 예측'}
          </button>
        </form>
      )}

      {/* 예측 결과 표시 */}
      {prediction !== null && predictionIndex !== null && (
        <div>
          <h2>진단 결과:</h2>
          <p>클래스 번호: {predictionIndex}</p>
          <p>이름: {prediction}</p>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ImageModel;
