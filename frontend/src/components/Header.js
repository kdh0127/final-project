import React from 'react';
import style from '../components/style/Header.module.css';


function Header(){
    
    const menuItems = [
        {name: "서비스소개", link: "/service"},
        {name: "이미지예측", link: "/management"},
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
                        <li key={index} className={style.nav_li}>
                            <a href={item.link} className={style.nav_a}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default Header;