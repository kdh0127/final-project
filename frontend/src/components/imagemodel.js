import React, { useState } from 'react';
import axios from 'axios';

function ImageModel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setPrediction(response.data.predicted_class_name);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file:" + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>진단하고자 하는 사진을 넣어주세요</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} disabled={loading} />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? '업로드 중...' : '업로드 및 예측'}
        </button>
      </form>
      {prediction && <div><h2>진단 결과:</h2><p>{prediction}</p></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ImageModel;
