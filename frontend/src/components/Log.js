import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Log = () => {
  const [message, setMessage] = useState('');
  const [userid, setUserid] = useState(''); // 수정: username -> userid
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // Axios에서 세션 쿠키를 전달할 수 있도록 설정
  axios.defaults.withCredentials = true;

  // 로그인 페이지로 돌아가도 로그인 안풀리게 설정
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (storedUser && isLoggedIn) {
      setLoggedIn(true);
      setLoggedInUser(storedUser);
    }
  }, []);

  // 로그인 요청
  const login = () => {
    axios.post('http://localhost:5000/api/login', { userid, password }) // 수정: username -> userid
      .then(response => {
        setLoggedIn(true);
        setLoggedInUser(response.data.user);

        // localStorage에 로그인 정보 저장
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loggedInUser', response.data.user);

        console.log(response.data.message);
        setMessage('로그인 성공!');
      })
      .catch(error => {
        console.error('Login failed:', error.response?.data?.message || error.message);
        setMessage('존재하지 않는 ID 또는 PW 입니다.');
      });
  };

  // 로그아웃 요청
  const logout = () => {
    axios.post('http://localhost:5000/api/logout')
      .then(response => {
        setLoggedIn(false);
        setLoggedInUser('');

        // localStorage에서 로그인 정보 제거
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('loggedInUser');

        console.log(response.data.message);
        setMessage('');
      })
      .catch(error => {
        console.error('Logout failed:', error.response?.data?.message || error.message);
        setMessage('로그아웃 실패.');
      });
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <div>
            <label>
              ID 
              <input
                type="text"
                placeholder="UserID"
                value={userid} // 수정: username -> userid
                onChange={(e) => setUserid(e.target.value)} // 수정: setUsername -> setUserid
              />
            </label>
          </div>

          <div>
            <label>
              PW 
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <h2>로그인</h2>
          <button onClick={login}>Login</button>

          {/* <h2>회원등록</h2>
          <button onClick={register}>Register</button> */}

          {/* {message && <p>{message}</p>} */}
        </div>
      ) : (
        <div>
          <h2>Welcome, {loggedInUser}!</h2> 
          <button onClick={logout}>Logout</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Log;
