import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Socket.IO 클라이언트
import style from '../style/Videodisease.module.css';
import Header from '../Header';

const socket = io('http://172.30.1.98:5002'); // Flask-SocketIO 서버 주소

function Videodisease() {
    const [logData, setlogData] = useState([]);

    useEffect(() => {
        // 서버로부터 문자 전송 이벤트 수신
        socket.on('sms_sent', (data) => {
            console.log("New message received:", data.message);
            setlogData((prevLogs) => [...prevLogs, data.message]); // 로그에 추가
        });

        // 컴포넌트 언마운트 시 이벤트 리스너 해제
        return () => {
            socket.off('sms_sent');
        };
    }, []);

    return (
        <div className={style.Videodisease_container}>
            <Header />
            <div className={style.main}>
                <div className={style.header}>
                    <div className={style.header_left}>
                        <h2 className={style.header_title}>감시시스템</h2>
                        <img src="/video.png" alt="비디오 아이콘자리" className={style.header_img} />
                    </div>
                    <div className={style.header_right}>
                        <h2 className={style.header_text}>
                            문자로그내역
                        </h2>
                    </div>
                </div>
                <div className={style.body}>
                    <div className={style.leftbody}>
                        <div className={style.streaming}>
                            {/* Flask 서버에서 제공하는 비디오 스트리밍 */}
                            <iframe
                                className={style.iframe}
                                src=" http://10.104.24.231:5001/video_feed"
                                title="Streaming Video"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <div className={style.rightbody}>
                        <div className={style.log}>
                            <ul className={style.log_list}>
                                {logData.map((log, index) => (
                                    <li className={style.log_item} key={index}>
                                        {log}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Videodisease;
