import React, { useEffect, useState } from 'react';
import style from '../style/Manage_request.module.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ManageRequest() {
  const [requests, setRequests] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [precaution, setPrecaution] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

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

  const handleApproveClick = (request) => {
    setCurrentRequest({ ...request, status: 'approve' });
    setModalIsOpen(true);
  };

  const handleRejectClick = (request) => {
    setCurrentRequest({ ...request, status: 'reject' });
    setModalIsOpen(true);
  };

  const handleClose = () => {
    setModalIsOpen(false);
    setScheduleDate('');
    setScheduleTime('');
    setPrecaution('');
    setRejectionReason('');
  };

  const handleApprove = async () => {
    if (!scheduleDate || !scheduleTime) {
      console.error('진료 일정이 설정되지 않았습니다.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('scheduled_date', scheduleDate); // 날짜
      formData.append('scheduled_time', scheduleTime); // 시간
      formData.append('precaution', precaution); // 예방 조치
  
      await axios.put(`http://localhost:5000/api/request/${currentRequest.id}/approve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // form-data 요청 명시
      });
  
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== currentRequest.id));
      handleClose();
    } catch (error) {
      console.error('승낙 처리 중 오류가 발생했습니다.', error);
    }
  };
  
  const handleReject = async () => {
    try {
      const formData = new FormData();
      formData.append('rejection_reason', rejectionReason); // 거부 사유 전달
  
      await axios.put(`http://localhost:5000/api/request/${currentRequest.id}/reject`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // form-data 요청 명시
      });
  
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== currentRequest.id));
      handleClose();
    } catch (error) {
      console.error('거부 처리 중 오류가 발생했습니다.', error);
    }
  };
  
  return (
    <div className={style.Manage_request}>
      <div className={style.boxContainer}>
        {requests.map((item) => (
          <Item key={item.id} sx={{ width: 950 }} className={style.item}>
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
                    <Button onClick={() => handleApproveClick(item)} className={style.item_yes}>승낙</Button>
                    <Button onClick={() => handleRejectClick(item)}>거부</Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </Item>
        ))}
      </div>

      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          {currentRequest && (
            <>
              {currentRequest.status === 'approve' ? (
                <div>
                  <Typography id="modal-title" variant="h6" component="h2">
                    승낙 처리
                  </Typography>
                  <label>
                    진료 일정:
                    <div>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </label>
                  <label>
                    예방 조치:
                    <textarea
                      value={precaution}
                      onChange={(e) => setPrecaution(e.target.value)}
                    ></textarea>
                  </label>
                  <Button onClick={() => { console.log('승낙 버튼 클릭됨'); handleApprove(); }}>승낙</Button>
                </div>
              ) : (
                <div>
                  <Typography id="modal-title" variant="h6" component="h2">
                    거부 처리
                  </Typography>
                  <label>
                    거부 사유:
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                  </label>
                  <Button onClick={() => { console.log('거부 버튼 클릭됨'); handleReject(); }}>거부</Button>
                </div>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ManageRequest;
