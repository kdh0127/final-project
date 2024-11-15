import React, { useState } from 'react';
import axios from 'axios';
import style from '../style/Request.module.css';

function RequestForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [symptomImage, setSymptomImage] = useState(null);
  const [symptomDescription, setSymptomDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('symptom_image', symptomImage);
    formData.append('symptom_description', symptomDescription);

    const response = await axios.post('http://localhost:5000/api/request', formData);

    if (response.status) {
      alert('진단 요청이 성공적으로 제출되었습니다!');
    } else {
      alert('진단 요청 제출에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <div className={style.submit}>
        <div className={style.personal_profile}>
          <div className="submittitle">
            <h2>진단요청서</h2>
          </div>
          <label>성함:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <label>주소:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          
          <label>전화번호:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
       </div>
      
      <div className={style.personal_image}>
        <label>증상 사진:</label>
        <input type="file" onChange={(e) => setSymptomImage(e.target.files[0])} required />
      </div>
      
      <div className={style.personal_description}>
        <label>증상 설명:</label>
        <textarea value={symptomDescription} onChange={(e) => setSymptomDescription(e.target.value)} required></textarea>
      </div>
      <div className={style.personal_require}>
      <button type="submit">진단 요청하기</button>
      </div>
     </div>

    </form>
  );
}

export default RequestForm;