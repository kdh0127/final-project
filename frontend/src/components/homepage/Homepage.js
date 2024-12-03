import React from 'react';
import style from '../style/Homepage.module.css';
import Header from '../Header';

function Homepage() {
    return (
        <div className={style.homepage}>
            <Header />
            <main className={style.maincontent} style={{backgroundImage: "url(/beekeeper.jpg)",}}>
                <div className={style.welcome}>
                    <p className={style.welcome_p}>
                        WELCOME TO <br />
                        <span className={style.beeCareful}>BEE CAREFUL!</span>
                    </p>
                </div>
                <div className={style.rightbody}>
                    <div className={style.loginbox}>
                        <div className={style.loginbox_title}>
                            BEE CAREFUL을 <br />시작하세요
                        </div>
                        <div className={style.loginbox_body}>
                            꿀벌 질병 감시시스템, 질병관리,
                            <br /> 진단챗봇 등 다양한 서비스를 <br />
                            한 곳에서 손쉽게 이용하세요.
                        </div>
                        <div className={style.loginbox_button}>
                            <button className={style.login}>로그인</button>
                            <button className={style.signup}>회원가입</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Homepage;
