import React, { useState } from 'react';
import style from '../style/Imagedisease.module.css';
import axios from 'axios';

function Imagedisease(){
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
    <div className={style.Imagedisease_container}>
      <h1 className={style.Imagedisease_title}>
        진단하고자 하는 사진을 넣어주세요
      </h1>
      <form onSubmit={handleSubmit} className={style.Imagedisease_form}>
        <input type="file" onChange={handleFileChange} disabled={loading} className={style.Imagedisease_input}/>
        <button type="submit" disabled={!selectedFile || loading} className={style.Imagedisease_button}>
          {loading ? '업로드 중...' : '업로드 및 예측'}
        </button>
      </form>
      {prediction && <div className={style.Imagedisease_prediction}>
        <h2 className={style.Imagedisease_result_title}>진단 결과:</h2>
        <p className={style.Imagedisease_result_text}>{prediction}</p></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Imagedisease;
