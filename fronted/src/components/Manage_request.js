import React, { useEffect, useState } from 'react';
import style from '../style/Manage_request.module.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ManageRequest() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request');
        setRequests(response.data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/request/${id}/approve`);
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== id));
    } catch (error) {
      console.error('승낙 처리 중 오류가 발생했습니다.', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/request/${id}/reject`);
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== id));
    } catch (error) {
      console.error('거부 처리 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className={style.Manage_request}>
      <div className={style.boxContainer}>
        {requests.map((item) => (
          <Item key={item.id} sx={{ width:950 }} className={style.item}>
            <div className={style.item_box}>
              <div className={style.item_left}>
                <h2>성함: {item.name}</h2>
                <p>양봉원주소: {item.address}</p>
                <p>전화번호: {item.phone}</p>
                <p>증상설명: {item.symptom_description}</p>
              </div>
              <div className={style.item_right}>
                {item.symptom_image && (
                  <div className={style.item_img}>
                    <img
                      src={`http://localhost:5000/${item.symptom_image}`}
                      alt="증상 이미지"
                      className={style.image}
                    />
                  </div>
                )}
                <div className={style.item_button}>
                  <ButtonGroup variant="outlined">
                    <Button onClick={() => handleApprove(item.id)} className={style.item_yes}>승낙</Button>
                    <Button onClick={() => handleReject(item.id)}>거부</Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </Item>
        ))}
      </div>
    </div>
  );
}

export default ManageRequest;


