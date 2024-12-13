import React, { useState } from 'react';
import style from '../style/Videodisease.module.css';
import Header from '../Header';

function Videodisease(){
    const[logData, setlogData] = useState([
        "1번 로그",
        "2번 로그",
        "3번 로그",
        "4번 로그",
    ]);

    return(
        <div className={style.Videodisease_container}>
            <Header />
            <div className={style.main}>
                <div className={style.header}>
                    <div className={style.header_left}>
                        <h2 className={style.header_title}>감시시스템</h2>
                        <img src="/video.png" alt="비디오 아이콘자리" className={style.header_img}/>
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
                            <iframe className={style.iframe}
                            src="https://www.youtube.com/embed/JYbybEKfchc?si=6WO6wxICqzRNhR73" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                    </div>
                    <div className={style.rightbody}>
                        <div className={style.log}>
                            <ul className={style.log_list}>
                                {logData.map((log, index) => ( 
                                    <li className={style.log_item} key={index}>
                                    {log}
                                </li> ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Videodisease;
