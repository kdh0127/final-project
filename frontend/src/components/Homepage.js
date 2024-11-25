import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/Homepage.module.css';

function Homepage(){
    return(
        <div className={style.app}>
            <div className={style.leftbox}>
                <div className={style.leftheader}>
                    <h1 className={style.leftheader_title}>양봉업자 웹서비스</h1>
                </div>
                <div className={style.leftmain}>
                    <div className={style.leftmain_header}><h2 className={style.leftmain_headertitle}>꿀벌 질병 예측 및 챗봇 지원</h2></div>
                    <div className={style.leftmain_info}>
                        <ul>
                            <li>질병 예측</li>
                            <li>AI챗봇</li>
                            <li>진단 요청하기</li>
                        </ul>
                        </div>
                    <div className={style.leftmain_btn}>
                        <Link to="/Beemain" className={style.btn}>바로가기</Link>
                    </div>
                    <div className={style.leftmain_foot}>
                        <strong>"양봉업자전용 서비스"</strong>
                    </div>
                </div>
            </div>
            <div className={style.rightbox}>
                <div className={style.rightheader}>
                    <h1 className={style.rightheader_title}>수의사 웹서비스</h1>
                </div>
                <div className={style.rightmain}>
                    <div className={style.rightmain_header}>
                        <h2 className={style.rightmain_headertitle}>수의사 진료요청관리 및 일정관리</h2>
                    </div>
                    <div className={style.rightmain_info}>
                        <ul>
                            <li>진료요청관리</li>
                            <li>일정관리</li>
                        </ul>
                    </div>
                    <div className={style.rightmain_btn}>
                        <Link to="/Doctormain" className={style.btn}>바로가기</Link>
                    </div>
                    <div className={style.rightmain_foot}>
                        <strong>"수의사전용 서비스"</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage;