import React from 'react';
import style from './style/Card.module.css';

const Card = ({ icon, title }) => {
    return(
        <div className={style.card}>
            <div className={style.icon}>
                <img src={icon} alt="아이콘자리" className={style.icon_img}/>
            </div>
            <div className={style.title}>
                {title}
            </div>
        </div>
    );
};

export default Card;