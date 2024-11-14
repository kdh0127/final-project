import React from 'react';
import style from '../style/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
    const imagePath = process.env.PUBLIC_URL + '/beelogo.jpeg';

    return (
        <div className={style.headerContainer}>
            {/* 로그인/회원가입 버튼을 위쪽에 배치 */}
            <div className={style.top}>
                <div className={style.topHeader}>
                    <button className={style.loginBtn}>
                        <FontAwesomeIcon icon={faUser} /> 로그인
                    </button>
                    <button className={style.signupBtn}>회원가입</button>
                </div>
            </div>
           

           
            <div className={style.mainHeader}>
                <div className={style.left}>
                    <div className={style.leftImg}>
                        <img src={imagePath} alt="Logo" className={style.headerLogo} />
                    </div>
                    <div className={style.leftText}>
                        <h2>꿀벌 질병 예측 및 <br />진단 지원 서비스</h2>
                    </div>
                </div>

                {/* 네비게이션 영역 */}
                <div className={style.nav}>
                    <div className={style.navItem}>
                        <Link to="/disease-management" className={style.navLink}>질병 관리</Link>
                        <div className={style.subMenu}>
                            <Link to="/record" className={style.subLink}>질병 기록</Link>
                            <Link to="/prediction" className={style.subLink}>질병 예측</Link>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <Link to="/ai" className={style.navLink}>진단 AI</Link>
                    </div>
                    <div className={style.navItem}>
                        <Link to="/diagnosis-service" className={style.navLink}>진단 서비스</Link>
                        <div className={style.subMenu}>
                            <Link to="/request" className={style.subLink}>진단 요청하기</Link>
                            <Link to="/manage_request" className={style.subLink}>진단 요청 관리</Link>
                        </div>
                    </div>
                        <div className={style.navItem}>
                            <Link to="/schedule" className={style.navLink}>일정 관리</Link>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default Header;
