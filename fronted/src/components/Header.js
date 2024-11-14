import React from 'react';
import style from '../style/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'; 

function Header() {

    const imagePath = process.env.PUBLIC_URL + '/beelogo.jpeg';

    return (
        <div className={style.App}>
                <div className={style.headerLeft}>
                    <div className={style.leftImg}>
                        <img src={imagePath} alt="Logo" className={style.headerLogo} />
                    </div>

                    <div className={style.leftText}>
                        <h2>꿀벌 질병 예측 및 <br />진단 지원 서비스 </h2>     
                    </div>
                </div>
                <div className={style.title}>
                    <h1>BEE Careful</h1>
                </div>

                <div className={style.headerRight}>
                    <div className={style.Buttons}>
                        <button className={style.loginBtn}>
                            <FontAwesomeIcon icon={faUser} /> 로그인
                        </button>
                        <button className={style.signupBtn}>회원가입</button>
                    </div>
                </div>
        </div>
    );
}

export default Header;
