import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Service from './components/service/Servicepage';

import Chatbot from './components/chatbot';
import ImageModel from './components/imagemodel';
import Log from './components/Log';
import Reg from './components/Reg';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
