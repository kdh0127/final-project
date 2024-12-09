import React, { useState, useEffect } from 'react';
import style from '../style/Support_partner.module.css';
import Header from '../Header';
import Support_card from '../support/Support_card';


function Support_partner(){

    const [isVisible, setIsVisible] = useState(false);
    
    const cardData = [
        {
            image: "/ic.jpg",
            alt: "green iguana",
            title: "신세계I&C",
            description: "신세계I&C의 우수한 매니저분들 덕분에 최상의 환경에서 작업을 할 수 있었습니다.",
            url: "https://shinsegae-inc.com/main.do",
        },
        {
            image: "academy.jpg",
            alt: "another animal",
            title: "SW인재양성사업단",
            description: "디지털스마트부산 아카데미를 통해 처음 코딩을 배웠습니다.",
            url: "https://swacademy.donga.ac.kr/sites/swacademy/index.do",
            
        },
        {
            image: "donga.jpg",
            title: "동아대학교",
            description: "동아대학교에서 여러가지 특강과 지원을 해주셨습니다.",
            url: "https://www.donga.ac.kr/kor/Main.do",
        },
        {
            image: "association1.jpg",
            title: "한국양봉협회",
            description: "양봉업자 분들의 의견과 여러 서비스를 검토하고 자료를 모으는 단계에서 도움을 얻었습니다.",
            url: "https://www.korapis.or.kr/jsp/main.jsp",
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300); 
        return () => clearTimeout(timer);
    }, []);

    return(
    <div className={style.Partner}>
        <Header />
        <main className={style.partner_main}>
            <div className={style.title}>
                <h4>협력 파트너</h4>
            </div>
            <div className={style.subtitle}>
                <span>BEE CAREFUL은 다양한 곳에서 도움을 받고 있습니다.</span>
            </div>
            <div className={style.cardbox}>
                {cardData.map((data, index) => (
                    <div
                        key={index}
                        className={`${style.card} ${isVisible ? style.visible : ''}`}
                        style={{ transitionDelay: `${index * 0.5}s` }}
                    >
                        <Support_card
                            image={data.image}
                            alt={data.alt}
                            title={data.title}
                            description={data.description}
                            url = {data.url}
                        />
                    </div>
                ))}
            </div>
        </main>
    </div>
)}

export default Support_partner;