import React from 'react';
import style from '../style/Management.module.css';
import Header from '../Header';
import Imagedisease from './Imagedisease';

function Management(){
    return(
        <div className={style.Management_container}>
            <Header />
            <div className={style.image_body}>
                <Imagedisease />
            </div>
        </div>
    )
}

export default Management;
