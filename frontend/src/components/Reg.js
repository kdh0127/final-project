import React, { useState } from 'react';
import axios from 'axios';
import style from './style/Reg.module.css';
import Header from './Header';

const Reg = () => {
  const [message, setMessage] = useState('');
  const [user_id, setUserId] = useState(''); // 수정: userid -> user_id
  const [password, setPassword] = useState('');
  const [realname, setRealname] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Axios에서 세션 쿠키를 전달할 수 있도록 설정
  axios.defaults.withCredentials = true;

  // 회원가입 요청
  const register = () => {
    const userData = {
      user_id, // 수정: userid -> user_id
      password,
      realname,
      address,
      phone
    };

    axios.post('http://localhost:5000/api/register', userData)
      .then(response => {
        console.log(response.data.message);
        setMessage('회원가입 성공!');
      })
      .catch(error => {
        console.error('Registration failed:', error.response?.data?.message || error.message);
        setMessage('회원가입 실패: 이미 존재하는 ID 입니다.');
      });
  };

  return (
  <div className={style.Rog}>
    <Header />
    <div className={style.rogmain}>
      <div className={style.rogbox}>
        <div className={style.leftrog}>
          <img src="/beekeeper1.jpg" alt="로그인 옆사진" />
        </div>
        <div className={style.rightrog}>
          <h1 className={style.signup}>회원가입</h1>
          <div>
            <label>
              <input
                type="text"
                placeholder="UserID" // 수정: Username -> UserID
                value={user_id} // 수정: userid -> user_id
                onChange={(e) => setUserId(e.target.value)} // 수정: setUserid -> setUserId
              />
            </label>
          </div>

          <div>
            <label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label> 
              <input
                type="text"
                placeholder="Real Name"
                value={realname}
                onChange={(e) => setRealname(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>
          <div>
          <button onClick={register}>Register</button>

          {message && <p>{message}</p>}
          </div>
        </div> 
        
      </div>
    </div>
   

    
  </div>
  );
};

export default Reg;
