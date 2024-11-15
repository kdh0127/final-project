import React, { useEffect, useState } from 'react';
import style from '../style/Manage_request.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function Manage_request() {
  const [requests, setRequests] = useState([]);  // 요청 목록 상태 변수

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request');
        setRequests(response.data);  // 백엔드에서 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      }
    };

    fetchRequests();
  }, []);  // 컴포넌트가 처음 렌더링될 때만 데이터 가져오기

  const handleRemove = async (id) => {
    try {
      // 서버로 삭제 요청 보내기
      await axios.delete(`http://localhost:5000/api/request/${id}`);
      // 서버에서 성공적으로 삭제된 후 프론트엔드 상태 업데이트
      setRequests((prevRequests) => prevRequests.filter(item => item.id !== id));
    } catch (error) {
      console.error('데이터 삭제 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className={style.Manage_request}>
      <Box className={style.boxContainer}>
        {requests.map((item) => (
          <Item key={item.id} sx={{ width: 950 }} className={style.item}>
            <div className={style.item_box}>
              <div className={style.item_left}>
                <h2>성함: {item.name}</h2>
                <p>양봉원주소: {item.address}</p>
                <p>전화번호: {item.phone}</p>
                <p>증상설명: {item.symptom_description}</p>
              </div>
              {/* 이미지가 있으면 표시 */}
              <div className={style.item_right}>
              {item.symptom_image && (
                <div className={style.item_img}>
                  <img
                  src={`http://localhost:5000/${item.symptom_image}`}
                  alt="증상 이미지"
                  />

                </div>
              )}
                <div className={style.item_button}>
                  <button className={style.item_yes}>
                    승낙
                  </button>
                  <button onClick={() => handleRemove(item.id)}>거부</button>
                  
                </div>
              </div>
            </div>
          </Item>
        ))}
      </Box>
    </div>
  );
}

export default Manage_request;

