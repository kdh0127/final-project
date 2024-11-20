import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Log = () => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('june8');
  const [password, setPassword] = useState('1234');
  const [realname, setRealname] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // Axios에서 세션 쿠키를 전달할 수 있도록 설정
  axios.defaults.withCredentials = true;

  // 로그인 페이지로 돌아가도 로그인 상태 유지
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (storedUser && isLoggedIn) {
      setLoggedIn(true);
      setLoggedInUser(storedUser);
    }
  }, []);

  // 회원가입 요청
  const register = () => {
    const userData = {
      username,
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
    <div>
      {!loggedIn ? (
        <div>
          <h1>회원가입</h1>

          <div>
            <label>
              ID 
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              PW 
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
              이름 
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
              주소 
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
              전화번호 
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <h2>회원등록</h2>
          <button onClick={register}>Register</button>

          {message && <p>{message}</p>}
        </div>
      ) : (
        <div>
          <h2>Welcome, {loggedInUser}!</h2> 
          <button onClick={() => {
            setLoggedIn(false);
            setLoggedInUser('');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('loggedInUser');
            setMessage('로그아웃 되었습니다.');
          }}>Logout</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Log;
