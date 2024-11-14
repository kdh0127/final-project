import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ManageRequest from './components/Manage_request'; 
import Request from './components/Request';
import Chatbot from './components/chatbot';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
        <Route path="/manage_request" element={<ManageRequest />} />
        <Route path="/request" element={<Request />} />
        <Route path="/ai" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
