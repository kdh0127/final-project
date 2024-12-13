import React, { useState, useEffect } from 'react';
import style from '../style/Homepage.module.css';
import Header from '../Header';
import Log from '../Log';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리
    const [realname, setRealname] = useState(''); // 로그인 성공 시 사용자 이름 관리
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedName = localStorage.getItem('realname');
        if (storedName) {
            setRealname(storedName);
        }
    }, []);

    const handleLoginClick = () => {    
        setShowPopup(true); // 팝업 열기
    };

    const handleClosePopup = () => {
        setShowPopup(false); // 팝업 닫기
    };

    const handleSignupClick = () => {
        handleClosePopup(); // 팝업 닫기
        navigate('/Reg'); // 회원가입 페이지로 이동
    };

    const handleLogout = () => {
        setRealname(''); // 로그인 상태 초기화
        localStorage.removeItem('realname');
        alert('로그아웃 되었습니다.');
    };

    return (
        <div className={style.homepage}>
            <Header />
            <main
                className={style.maincontent}
                style={{ backgroundImage: "url(/beekeeper.jpg)" }}
            >
                <div className={style.welcome}>
                    <p className={style.welcome_p}>
                        WELCOME TO <br />
                        <span className={style.beeCareful}>BEE CAREFUL!</span>
                    </p>
                </div>
                <div className={style.rightbody}>
                    <div className={style.loginbox}>
                        <div className={style.loginbox_title}>
                            {realname ? (
                                <>
                                    <span>{realname}님! 환영합니다</span>
                                </>
                            ) : (
                                <>
                                    BEE CAREFUL을 <br />시작하세요
                                </>
                            )}
                        </div>
                        <div className={style.loginbox_body}>
                            {realname ? (
                                <p></p>
                            ) : (
                                <>
                                    꿀벌 질병 감시시스템, 질병관리,
                                    <br /> 진단챗봇 등 다양한 서비스를 <br />
                                    한 곳에서 손쉽게 이용하세요.
                                </>
                            )}
                        </div>
                        <div className={style.loginbox_button}>
                            {realname ? (
                                <button className={style.logout} onClick={handleLogout}>
                                    로그아웃
                                </button>
                            ) : (
                                <>
                                    <button
                                        className={style.login}
                                        onClick={handleLoginClick}
                                    >
                                        로그인
                                    </button>
                                    <button
                                        className={style.signup}
                                        onClick={handleSignupClick} // 회원가입 페이지로 이동
                                    >
                                        회원가입
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* 팝업 */}
            {showPopup && (
                <div className="popupOverlay" onClick={handleClosePopup}>
                    <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                        <span className="closeBtn" onClick={handleClosePopup}>
                            &times;
                        </span>
                        <h4 className={style.popup_title}>Log In</h4>
                        <Log
                            onClose={handleClosePopup}
                            onLoginSuccess={(name) => {
                                setRealname(name); // 로그인 성공 시 이름 저장
                                localStorage.setItem('realname', name);
                                setShowPopup(false); // 팝업 닫기
                            }}
                        />
                        {/* 회원가입 버튼 */}
                        <div className={style.signupSection}>
                        <span className={style.signupText}>아직 계정이 없으신가요?</span>
                            <p onClick={handleSignupClick} className={style.signupBtnInsidePopup}>
                                회원가입
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homepage;
