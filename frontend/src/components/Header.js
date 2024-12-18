import React from 'react';
import style from '../components/style/Header.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Header(){

    const location = useLocation();
    const navigate = useNavigate();
    
    const currentPath = location.pathname;
    const handleMyinfo = () => {
        navigate('/account');
    };

    const menuItems = [
        {name: "서비스소개", link: "/service"},
        {name: "이미지예측", link: "/image"},
        {name: "영상감시", link: "/video"},
        {name: "진단AI", link: "/chatbot"},
        {name: "커뮤니티", link: "/community"},
        {name: "고객센터", link: "/support"},
    ]

    return(
        <header className={style.header}>
            <div className={style.leftheader}>
                <h4><a className={style.header_a} href="/">BEE CAREFUL</a></h4>
            </div>
            <nav className={style.rightheader}>
                <ul className={style.nav_ul}>
                    {menuItems.map((item, index) => (
                        <li key={index} className={`${style.nav_li} ${currentPath === item.link ? style.active : ''}`}>
                            <a 
                            href={item.link} 
                            className={style.nav_a}>
                                {item.name}</a>
                        </li>
                    ))}
                   
                </ul>
            </nav> 
            <div className={style.account}>
                <button className={style.account_button} onClick={handleMyinfo}>
                    내정보
                </button>
            </div>
        </header>
    )
}

export default Header;