import React, { useState, useEffect } from 'react';
import style from '../style/Homepage.module.css';
import Header from './components/Header';

function Homepage(){

    return(
        <div className={style.homepage}>
            <Header/>
            <main className={style.maincontent}>
                
            </main>
        </div>
    )
}

export default Homepage;