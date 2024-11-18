import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ManageRequest from './components/Manage_request'; 
import Request from './components/Request';
import Chatbot from './components/chatbot';
import Calender from './components/Calender';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
        <Route path="/manage_request" element={<ManageRequest />} />
        <Route path="/request" element={<Request />} />
        <Route path="/ai" element={<Chatbot />} />
        <Route path="/schedule" element={<Calender />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
