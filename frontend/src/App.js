import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Chatbot from './components/chatbot';
import ImageModel from './components/imagemodel';
import Log from './components/Log';
import Reg from './components/Reg';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
        <Route path="/ai" element={<Chatbot />} />
        <Route path="/Image_Model" element={<ImageModel />} />
        <Route path="/Log" element={<Log />} />
        <Route path="/Reg" element={<Reg />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
