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
            title: "신규 양봉업자를 위한 질병관리 서비스",
            article: "구성원 | 배규태 고지수 김도헌 서지민 정동윤",
            more: "더 알아보기",
            imageUrl: "servicelogo1.png", 
          },
          {
            header: "Beecareful의 첫 번째 서비스",
            subheader: "간편하게 질병명을 알아보는 서비스",
            title: "질병 이미지분류",
            article: "직접 찍은 사진으로 바로 질병을 확인할 수 있습니다. 정확하고 빠른 이미지 진단으로 대처하세요.",
            more: "더 알아보기",
            imageUrl: "result_bee.jpg", 
          },
          {
            header: "Beecareful의 두 번째 서비스",
            subheader: "질병의 발생을 감시해주는 서비스",
            title: "질병 발생 감시",
            article: "벌통에 설치된 카메라를 통해  질병이 발생시 문자메세지를 발송해줍니다. 이 서비스로 초기에 대응하세요.",
            more: "더 알아보기",
            imageUrl: "result2.jpg", 
          },
          {
            header: "Beecareful의 세 번째 서비스",
            subheader: "꿀벌에 관한 다양한 정보를 제공해주는 서비스",
            title: "꿀벌 특화 Chatbot",
            article: "꿀벌질병에 대한 예방조치 부터 치료법, 주변 환경조성 등 다양한 부분을 대답해드립니다.",
            more: "더 알아보기",
            imageUrl: "beechat.png", 
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
                    screens={screens}
                    currentScreen={currentScreen}
                    setCurrentScreen={setCurrentScreen}
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