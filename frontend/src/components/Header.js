import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/Header.module.css';

function Header() {
    const imagePath = process.env.PUBLIC_URL + '/beelogo2.png';

    return (
        
        <div className={style.App}>
            <div className={style.headerTop}>
                <Link to="/Log" className={style.loginBtn}>
                로그인
                </Link>
                <Link to="/Reg" className={style.signupBtn}>
                    회원가입
                </Link>
            </div>

            <div className={style.headerBottom}>
                    <div className={style.leftImg}>
                        <img src={imagePath} alt="Logo" className={style.headerLogo} />
                    </div>

                    {/* <div className={style.List1}>
                        <Link to="/record" className={style.Link} onMouse>질병기록</Link>
                    </div> */}
                    <div className={style.List2}>
                        <Link to="/ai" className={style.Link}>진단AI</Link>
                    </div>
                    <div className={style.List3}>
                        <Link to="/Image_Model" className={style.Link}>질병예측</Link>
                    </div>

                    {/* 양봉업자 분들을 위한 페이지 */}
                    <div className={style.List4}>
                        <Link to="/request" className={style.Link}>진단요청하기</Link>
                    </div>

                    {/* 수의사 분들이 필요한 페이지 */}
                    <div className={style.List5}>
                        <Link to="/manage_request" className={style.Link}>진단요청관리</Link>
                    </div>
                    <div className={style.List6}>
                        <Link to="/calendar" className={style.Link}>일정관리</Link>
                    </div>
                </div>

        </div>
    );
}

export default Header;
