import React from 'react';
import style from '../style/Management.module.css';
import Header from '../Header';
import Imagedisease from './Imagedisease';
import Videodisease from './Videodisease';

function Management(){
    return(
        <div className={style.Management_container}>
            <Header />
            <div className={style.image_body}>
                <Imagedisease />
            </div>
            <div className={style.video_body}>
                <Videodisease />
            </div>
        </div>
    )
}

export default Management;
