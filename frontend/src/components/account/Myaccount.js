import React from 'react';
import style from '../style/Myaccount.module.css';
import Header from '../Header';

function Myaccount(){
    return(
        <div className={style.main}>
            <Header />
            <div className={style.body}>
                 <div className={style.top}>
                    <h2>COMING SOON</h2>
                 </div>
                 <div className={style.middle}>
                    <p>잠시만 기다려주세요.<br/>
                    곧 찾아뵙겠습니다!</p>
                 </div>
                 <div className={style.bottom}>
                    
                 </div>
            </div>
        </div>
    )
}

export default Myaccount;