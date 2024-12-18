import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 홈페이지
import Homepage from './components/homepage/Homepage';


// 서비스페이지
import Service from './components/service/Servicepage';


// 고객센터페이지
import Support from './components/support/Support';
import Support_inpage from './components/support/Support_inpage';
import Support_partner from './components/support/Support_partner';


// 이미지예측페이지
import Imagedisease from './components/disease/Imagedisease';
import Videodisease from './components/disease/Videodisease';



// 챗봇페이지
import Chatbot from './components/chatbot';

// 로그인,로그아웃 페이지
import Log from './components/Log';
import Reg from './components/Reg';

// 커뮤니티 페이지
import BoardList from "./components/community/BoardList";
import PostWrite from "./components/community/WritePost";
import PostDetail from "./components/community/Postdetail";

// 내정보 페이지
import Myaccount from "./components/account/Myaccount";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 홈페이지 */}
          <Route path="/" element={<Homepage/>} />

          {/* 서비스페이지 */}
          <Route path="/service" element={<Service />} />

          {/* 챗봇페이지 */}
          <Route path="/chatbot" element={<Chatbot />} />

          {/* 로그인,로그아웃페이지 */}
          <Route path="/Log" element={<Log />} />
          <Route path="/Reg" element={<Reg />} />

          {/* 고객센터페이지 */}
          <Route path="/support" element={<Support />} />
          <Route path="/support-service" element={<Support_inpage />} />
          <Route path="/support-partner" element={<Support_partner />} />

          {/* 질병관리 페이지 */}
          <Route path="/image" element={<Imagedisease />} />
          <Route path="/video" element={<Videodisease />} />

          {/* 커뮤니티 페이지 */}
          <Route path="/community" element={<BoardList />} /> 
          <Route path="/board/write" element={<PostWrite />} />
          <Route path="/board/:post_id" element={<PostDetail />} />

          {/* 내정보 페이지 */}
          <Route path="/account" element={<Myaccount />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
