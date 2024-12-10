import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import style from '../components/style/Chatbot.module.css';


const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


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
    <div className={style.chatbot_wrapper}>
      <Header/>
      <div className={style.chatbot_container}>
        <div class="image_text_container">
          <img src="/beelogo2.png" alt="bee icon" className={style.title_image} /> 
          <span class="chatbot_container">Welcome to Chatbot</span>
        </div>

        

        {messages.length > 0 && (
          <div className={style.chat_history}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.type === 'user' ? style.user_message : style.bot_message}
                style={{whiteSpace:'pre-wrap'}}
              >
                {formatTextWithBreaks(message.text)}  {/* 줄바꿈 처리 */}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }} className={style.input_container}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="질문을 입력하세요."
          />
          <button type="submit"> 전송 </button>
        </form>

        {loading && <p>로딩 중...</p>}
      </div>
    </div>
  );
};