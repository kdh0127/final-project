import React from 'react';
import style from '../style/Videodisease.module.css';
import Header from '../Header';

function Videodisease(){
    return(
        <div className={style.Videodisease_container}>
            <Header />
            <div className={style.main}>
                test
            </div>
        </div>
    )
}

export default Videodisease;
