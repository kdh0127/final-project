import React, { useState, useEffect } from 'react';
import style from '../style/Service.module.css'
import Header from '../Header';
import Screen from '../Screen';

function Service(){

    const [currentScreen, setCurrentScreen]= useState(0);

    const screens=[
        {   
            header: "디지털 스마트 부산 아카데미",
            subheader: "9월 2일 ~ 12월 20일 | B04(C)-0107",
            title: "신규 양봉업자를 위한 꿀벌 질병 진단 및 치료 편의 제공 서비스",
            article: "구성원 | 배규태 고지수 김도헌 서지민 정동윤",
            more: "더 알아보기",
            imageUrl: "/images/image1.jpg", 
          },
          {
            header: "Screen 2 Header",
            subheader: "Screen 2 subHeader",
            title: "Discover Screen 2",
            article: "This is the second screen content.",
            more: "Discover",
            imageUrl: "/images/image2.jpg", 
          },
          {
            header: "Screen 3 Header",
            subheader: "Screen 3 subHeader",
            title: "Explore Screen 3",
            article: "This is the third screen content.",
            more: "Explore",
            imageUrl: "/images/image3.jpg", 
          },
        ];

        useEffect( ()=> {
            const interval = setInterval( () => {
                setCurrentScreen((prev) => (prev+1) % screens.length);
            }, 5000);
            return () => clearInterval(interval);
        }, [screens.length]);
    return(
        <div className={style.service}>
            <Header />
            <main className={style.mainservice}>
                <div className={style.service1}>
                    <Screen
                    header={screens[currentScreen].header}
                    subheader={screens[currentScreen].subheader}
                    title={screens[currentScreen].title}
                    article={screens[currentScreen].article}
                    more={screens[currentScreen].more}
                    imageUrl={screens[currentScreen].imageUrl}
                    />
                </div>
                <div className={style.service2}>
                    
                </div>
                <div className={style.service3}>

                </div>
                <div className={style.service4}>

                </div>
                <div className={style.service5}>

                </div>
            </main>
        </div>
    )
}

export default Service;