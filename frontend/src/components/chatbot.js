import React, { useState } from 'react';
import axios from 'axios';
import './style/Chatbot.css';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "벌통 주변에 흰 보리쌀<br /> 같은 것이 생겼어요",
    "벌이 날지 않아요",
    "벌이 설사를 해요"
  ];

  // <br /> 태그를 실제 줄바꿈으로 처리하는 함수
  const formatTextWithBreaks = (text) => {
    return text.split('<br />').map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index !== text.split('<br />').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuickQuestionClick = (question) => {
    const sanitizedQuestion = question.replace(/<br \/>/g, ''); // <br /> 태그 제거
    setQuery(sanitizedQuestion);  // sanitizedQuestion을 query에 저장
    handleSubmit(sanitizedQuestion);  // 해당 질문에 대한 응답을 자동으로 생성
  };

  const handleSubmit = async (e) => {
    if (typeof e === 'string') {
      setQuery(e);  // e가 string일 경우 query에 값 설정
    }
    if (!query) return;

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: query }]);
    setQuery('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ask', { query });
      const result = res.data.response || '응답이 없습니다';
      const formattedResponse = result.replace(/\n/g, '<br />');
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: formattedResponse }
      ]);
    } catch (error) {
      console.error("응답을 가져오는 중 오류 발생: ", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: '오류: 응답을 가져올 수 없습니다' }
      ]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <h2>Chatbot</h2>

        <div className="quick-questions">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestionClick(question)} // 버튼 클릭 시 해당 질문에 대한 응답 호출
              className="quick-question-button"
            >
              {formatTextWithBreaks(question)} {/* 줄바꿈 처리 */}
            </button>
          ))}
        </div>

        {messages.length > 0 && (
          <div className="chat-history">
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.type === 'user' ? 'user-message' : 'bot-message'}
                style={{whiteSpace:'pre-wrap'}}
              >
                {formatTextWithBreaks(message.text)}  {/* 줄바꿈 처리 */}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }} className="input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="질문을 입력하세요..."
          />
          <button type="submit">질문하기</button>
        </form>

        {loading && <p>로딩 중...</p>}
      </div>
    </div>
  );
};

export default Chatbot; 