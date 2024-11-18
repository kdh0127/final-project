import React from 'react';
import style from '../style/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
    const imagePath = process.env.PUBLIC_URL + '/beelogo.jpeg';

    return (
        <div className={style.headerContainer}>
            {/* 상단: 로그인/회원가입 버튼 */}
            <div className={style.topContainer}>
                <div className={style.topButtons}>
                    {/* 로그인 버튼 */}
                    <Link to="/Logleg" className={style.loginBtn}>
                    <FontAwesomeIcon icon={faUser} /> 로그인
                </Link>

                {/* 회원가입 버튼 */}
                <Link to="/Logleg" className={style.signupBtn}>
                        회원가입
                </Link>

            </div>
        </div>
    
        {/* 하단: 로고 및 제목, 네비게이션 메뉴 */}
        <div className={style.bottomContainer}>
            {/* 왼쪽: 로고와 제목 */}
            <div className={style.leftSection}>
                <div className={style.logoContainer}>
                    <img src={imagePath} alt="Logo" className={style.headerLogo} />
                </div>
                <div className={style.titleContainer}>
                    <h2>꿀벌 질병 예측 및 <br />진단 지원 서비스</h2>
                </div>
            </div>
    
            {/* 오른쪽: 네비게이션 메뉴 */}
            <div className={style.navContainer}>
                {/* 질병 관리 */}
                <div className={style.navItem}>
                    <Link to="/disease-management" className={style.navLink}>질병 관리</Link>
                    <div className={style.subMenu}>
                        <Link to="/record" className={style.subLink}>질병 기록</Link>
                        <Link to="/prediction" className={style.subLink}>질병 예측</Link>
                    </div>
                </div>
    
                {/* 진단 AI */}
                <div className={style.navItem}>
                    <Link to="/ai" className={style.navLink}>진단 AI</Link>
                </div>
    
                {/* 진단 서비스 */}
                <div className={style.navItem}>
                    <Link to="/diagnosis-service" className={style.navLink}>진단 서비스</Link>
                    <div className={style.subMenu}>
                        <Link to="/request" className={style.subLink}>진단 요청하기</Link>
                        <Link to="/manage_request" className={style.subLink}>진단 요청 관리</Link>
                    </div>
                </div>
    
                {/* 일정 관리 */}
                <div className={style.navItem}>
                    <Link to="/schedule" className={style.navLink}>일정 관리</Link>
                </div>
            </div>
        </div>
    </div>
    
    );
}

export default Header;
