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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


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
  const [schedule, setSchedule] = useState(null); // DateTimePicker는 null로 초기화
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
    setSchedule(null); // Modal 닫을 때 초기화
    setPrecaution('');
    setRejectionReason('');
  };

  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:5000/api/request/${currentRequest.id}/approve`, {
        schedule,
        precaution,
      });
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== currentRequest.id));
      handleClose();
    } catch (error) {
      console.error('승낙 처리 중 오류가 발생했습니다.', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`http://localhost:5000/api/request/${currentRequest.id}/reject`, {
        rejectionReason,
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(props) => <input {...props} />}
                        value={schedule}
                        onChange={(newValue) => setSchedule(newValue)}
                        ampm={false} // 24시간 형식
                        disablePast
                      />
                    </LocalizationProvider>
                  </label>
                  <label>
                    예방 조치:
                    <textarea
                      value={precaution}
                      onChange={(e) => setPrecaution(e.target.value)}
                    ></textarea>
                  </label>
                  <Button onClick={handleApprove}>승낙</Button>
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
                  <Button onClick={handleReject}>거부</Button>
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
