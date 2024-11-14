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

  return (
    <div className={style.Manage_request}>
      <Box className={style.boxContainer}>
        {requests.map((item) => (
          <Item key={item.id} sx={{ width: 1800 }} className={style.item}>
            <div>
              <h2>{item.name}</h2>
              <p>{item.symptom_description}</p>
              <p>주소: {item.address}</p>
              <p>전화번호: {item.phone}</p>
              {/* 이미지가 있으면 표시 */}
              {item.symptom_image && (
                <img
                src={`http://localhost:5000/${item.symptom_image}`}
                alt="증상 이미지"
                style={{ maxWidth: '100%', height: 'auto' }}
                />
              )}
            </div>
          </Item>
        ))}
      </Box>
    </div>
  );
}

export default Manage_request;

