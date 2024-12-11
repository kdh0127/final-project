import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './Header';
import style from '../components/style/Chatbot.module.css';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
    if (!query) return;

    e.preventDefault();
    // 사용자가 입력한 메시지를 추가
    setIsChatStarted(true);
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: query }]);
    setQuery('');

    // 로딩 메시지를 추가
    setMessages((prevMessages) => [...prevMessages, { type: 'loading', text: '' }]);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ask', { query });
      const result = res.data.response || '응답이 없습니다';
      const formattedResponse = result.replace(/\n/g, '<br />');

      // 로딩 메시지를 실제 응답 메시지로 교체
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = { type: 'bot', text: formattedResponse };
        return updatedMessages;
      });
    } catch (error) {
      console.error("응답을 가져오는 중 오류 발생: ", error);

      // 로딩 메시지를 오류 메시지로 교체
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = { type: 'bot', text: '오류: 응답을 가져올 수 없습니다' };
        return updatedMessages;
      });
    }
  };

  return (
    <div className={style.chatbot_wrapper}>
      <Header />
      <div className={style.mainbody}>
        <div className={style.leftbody}>
        </div>
      
        <div className={style.chatbot_container}>
          <div className={style.container_title}>
            <img src="/beechatlogo.png" alt="beechatlogo 자리" className={style.container_title_logo} />
            <span className={style.container_title_span}>
              BeeChat
            </span>
          </div>
          {messages.length === 0 && (
            <div className={style.image_text_container}>
              <span className={style.chatbot_title}>Welcome to Bee Chat</span>
            </div>
          )}
          <div className={style.chat_history} ref={chatRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.type === 'user'
                    ? style.user_message
                    : message.type === 'loading'
                    ? style.loading_message
                    : style.bot_message
                }
              >
                {message.type === 'loading' ? '로딩 중...' : formatTextWithBreaks(message.text)}
              </div>
              
            ))}
          </div>
          <div className={`${style.input_container} ${
            isChatStarted ? style.active : ''}`}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="질문을 입력하세요."
                className={style.input}
              />
              <button type="submit" className={style.button}>전송</button>
            </form>
          </div>
        </div>

        <div className={style.rightbody}>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;
