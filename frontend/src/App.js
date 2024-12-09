import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Service from './components/service/Servicepage';
import Support from './components/support/Support';
import Support_inpage from './components/support/Support_inpage';
import Support_partner from './components/support/Support_partner';

import Chatbot from './components/chatbot';
import ImageModel from './components/imagemodel';
import Log from './components/Log';
import Reg from './components/Reg';
import BoardList from "./components/community/BoardList";
import PostWrite from "./components/community/WritePost";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/service" element={<Service />} />

          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/Image_Model" element={<ImageModel />} />
          <Route path="/Log" element={<Log />} />
          <Route path="/Reg" element={<Reg />} />
          <Route path="/community" element={<BoardList />} /> 

          <Route path="/support" element={<Support />} />
          <Route path="/support-service" element={<Support_inpage />} />
          <Route path="/support-partner" element={<Support_partner />} />

          <Route path="/board/write" element={<PostWrite />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
