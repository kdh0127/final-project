import React, { useState, useRef } from 'react';
import style from '../style/Imagedisease.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import Header from '../Header';

function Imagedisease(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewURL, setPreviewURL] = useState(null);
    const fileInputRef = useRef(null);
    
    
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
            setPreviewURL(URL.createObjectURL(files[0]));
        }
        };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    
    const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);};

    const handleDragLeave = () => {
    setIsDragging(false);};
    
    const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files[0]) {
        setSelectedFile(files[0]);
        setPreviewURL(URL.createObjectURL(files[0]));
    }
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
    <div className={style.main}>
        <Header />
        <div className={style.Imagedisease_container}>
            <div className={style.top}>
                <div className={style.top_logo}>
                    <h2>이미지 분류</h2>
                    <FontAwesomeIcon icon={faImage} />
                </div>
            </div>
            <div className={style.body}>
                <div className={style.leftbody}>
                    <div className={style.leftbody_title}>
                        <h1 className={style.Imagedisease_title}>
                            진단하고자 하는 사진을 넣어주세요
                        </h1>
                        <form onSubmit={handleSubmit} className={style.Imagedisease_form}>
                            <div
                                className={`${style.dropzone} ${isDragging ? style.dragging : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleClick}>
                                
                                {selectedFile ? (
                                    <div className={style.previewContainer}>
                                    
                                    {previewURL && (
                                        <img src={previewURL} alt="미리보기" className={style.previewImageInDropzone} />
                                    )}
                                    
                                    <p className={style.fileName}>{selectedFile.name}</p>
                                </div>
                                ) : (
                                    <p>파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                                )}
                            </div>
                            <input
                                    type="file"
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }} 
                                />
                            <button type="submit" disabled={!selectedFile || loading} className={style.Imagedisease_button}>
                                {loading ? '업로드 중...' : '업로드 및 예측'}
                            </button>
                        </form>
                    </div>
                    
                </div>
                <div className={style.rightbody}>
                    <div className={style.rightbody_main}>
                        <div className={style.rightbody_img}>
                        {loading ? (
                            <p className={style.loadingText}>예측 결과를 처리 중입니다...</p>
                        ) : previewURL ? (
                            prediction ? (
                                prediction === "normal" ? (
                                    <p className={style.resultText}>이미지가 정상으로 진단되었습니다.</p>
                                ) : prediction === "ung" ? (
                                    <p className={style.resultText}>비정상적인 이미지로 진단되었습니다. 추가 검토가 필요합니다.</p>
                                ) :  prediction === "fether" ? (
                                    <p className={style.resultText}>날개불구감염</p>
                                ) : (
                                    <p className={style.resultText}>진단 결과: {prediction}</p>
                                )
                            ) : (
                                <img src={previewURL} alt="미리보기" className={style.previewImage} />
                            )
                        ) : (
                            "이미지를 업로드하면 여기에 표시됩니다"
                        )}
                        </div>
                        <div className={style.rightbody_text}>
                            {prediction && 
                            <div className={style.Imagedisease_prediction}>
                                <h2 className={style.Imagedisease_result_title}>진단 결과:</h2>
                                <p className={style.Imagedisease_result_text}>{prediction}</p>
                            </div>}
                            {error && <p style={{ color: 'red' }} className={style.text_error}>{error}</p>}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default Imagedisease;
