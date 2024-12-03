import React, { useState, useEffect } from 'react';
import style from '../style/Homepage.module.css';
import Header from '../Header';

function Homepage(){

    return(
        <div className={style.homepage}>
            <Header/>
            <main className={style.maincontent} style={{backgroundImage: "url(/beekeeper.jpg)",}}>

                <div className={style.welcome}>
                    <p className={style.welcome_p}>WELCOME TO <br/><span className={style.beeCareful}>BEE CAREFUL!</span> </p>
                </div>
                <div className={style.loginbox}>
                    
                </div>
            </main>
        </div>
    )
}

export default Homepage;