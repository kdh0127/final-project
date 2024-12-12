import React from 'react';
import style from '../style/Videodisease.module.css';
import Header from '../Header';

function Videodisease(){
    return(
        <div className={style.Videodisease_container}>
            <Header />
            <div className={style.main}>
                <div className={style.top}>
                    <div className={style.top_box}>
                        <h2 className={style.top_title}>감시시스템</h2>
                        <img src="/video.png" alt="비디오 아이콘자리" className={style.top_img}/>
                    </div>
                </div>
                <div className={style.body}>
                    <div className={style.leftbody}>
                        <div className={style.left_container1}>
                            <div className={style.upbox}>
                                <div className={style.left_topbox1}>
                                    <span className={style.box_span}>
                                        10분 전
                                    </span>
                                </div>
                                <div className={style.left_topbox2}>
                                    <span className={style.box_span}>
                                        30분 전
                                    </span>
                                </div>
                                <div className={style.left_topbox3}>
                                    <span className={style.box_span}>
                                        1시간 전
                                    </span>
                                </div>
                            </div>
                            <div className={style.downbox}>
                                <div className={style.left_topbox4}>
                                    <span className={style.box_span}>
                                        6시간 전
                                    </span>
                                </div>
                                <div className={style.left_topbox5}>
                                    <span className={style.box_span}>
                                        12시간 전
                                    </span>
                                </div>
                                <div className={style.left_topbox6}>
                                    <span className={style.box_span}>
                                        1일 전
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={style.left_container2}>
                            <div className={style.example_up}>
                                <span className={style.example_title}>
                                    문자 예시
                                </span>
                            </div>
                            <div className={style.example_down}>
                                <span className={style.example_text}>
                                    <br/>[Web발신] <br/><br/> □ 15:06 부산광역시 기장군 기장읍 기장대로 313 <br/><br/> □ [3번 벌통] 응애병 감지
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={style.rightbody}>
                        <div className={style.video_text}>
                            <span className={style.video_span}>영상자리</span>
                        </div>
                        <div className={style.videobox}>
                            test
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Videodisease;
