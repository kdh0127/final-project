import React, { useState } from 'react';
import axios from 'axios';
import './style/Log.css';

const Log = ({ onClose, onLoginSuccess }) => {
  const [user_id, setUserId] = useState('');
  const [password, setPassword] = useState('');

  axios.defaults.withCredentials = true;

  const login = () => {
    axios.post('http://localhost:5000/api/login', { user_id, password })
      .then(response => {
        const { user } = response.data; // 서버에서 반환된 사용자 정보

        if (user && user.realname) {
          // 로그인 성공 시 실명을 onLoginSuccess로 전달
          if (onLoginSuccess) onLoginSuccess(user.realname);

          // 팝업 닫기
          if (onClose) onClose();
        } else {
          alert('서버에서 사용자 정보가 제대로 반환되지 않았습니다.');
        }
      })
      .catch(error => {
        console.error('Login failed:', error.response?.data?.message || error.message);
        alert('존재하지 않는 ID 또는 PW 입니다.'); // 실패 시 알림 표시
      });
  };

  return (
    <div className="log-wrapper">
      <div className="login-form">
        <label>
          ID:
          <input
            type="text"
            placeholder="UserID"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <label>
          PW:
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
};

export default Log;
