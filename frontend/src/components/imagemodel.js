import React, { useState } from 'react';
import axios from 'axios';




function ImageModel() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [predictionIndex, setPredictionIndex] = useState(null);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await axios.post('http://localhost:5000/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Server response:", response.data);  // 서버 응답 확인
        setPrediction(response.data.predicted_class_name);  // 예측된 클래스 이름 설정
        setPredictionIndex(response.data.predicted_class);  // 예측된 클래스 번호 설정
      } catch (error) {
        console.error("Error uploading file:", error);
        if (error.response) {
          console.error("Server error:", error.response.data);
        }
      }
    };
  
    return (
      <div>
  
  
        
  
       
  
        <div>
          <h1>진단하고자 하는 사진을 넣어주세요</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">업로드 및 예측</button>
          </form>
          {prediction !== null && predictionIndex !== null && (
            <div>
              <h2>진단 결과:</h2>
              <p>클래스 번호: {predictionIndex}</p>
              <p>이름: {prediction}</p>
            </div>
          )}
        </div>
  
      </div>
    );
  }
  
  export default ImageModel;