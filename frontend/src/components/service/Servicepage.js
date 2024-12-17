import React, { useState, useEffect } from 'react';
import style from '../style/Service.module.css'
import Header from '../Header';
import Screen from '../Screen';
import Servicebody from '../Servicebody';
import { FaArrowUp } from "react-icons/fa";

function Service(){
    const bodyText0 = `팀장 배규태 | 팀원 고지수 김도헌 정동윤 서지민 <br/><br/> 
    배규태: 전반적인 업무와 일정을 총괄하고 있는 <br/>팀장 배규태입니다. 기술적으로는 백엔드와 머신러닝 <br/>모델을 담당하며 팀원들에게 도움이 되기위해 최선을 <br/>다하겠습니다.<br/><br/> 고지수: 팀에서 발표와 문서작업, 웹디자인을 담당하고<br/> 있습니다. 기술적으로 피그마와 css를 사용하고 있습니다.<br/><br/> 김도헌: 팀에서 프론트엔드를 총괄하여 담당하고 있습니다.<br/> 서브로는 open-api를 이용하여 챗봇서비스를 만들었습니다.<br/> 최고의 결과물을 만들기 위해 최선의 노력을 다하겠습니다. <br/><br/> 정동윤: 팀에서 데이터베이스를 총괄하여 담당하였고 <br/>서브로는 백엔드를 도와주었습니다.  <br/><br/>서지민: 팀에서 서류작업, ppt 등 발표준비를 총괄하였습니다.<br/> `

    const bodyText1 = `
    이미지 학습을 위해 CNN 모델 중에서 VGG16과 <br/>EfficientNet을 선정하여 사용하였습니다.<br/>
    <br/>VGG16의 경우 다른 모델에 비해 구조가 상대적으로 <br/>단순하고 대중적으로 널리 쓰이고
    Tensorflow에서 <br/>모델이 제공되어 파인튜닝 하기에 용이하였습니다.<br/><br/>
    EfficientNet 또한 사전 학습된 모델이 제공되고 <br/>compound scaling 이 도입되어
    다른 모델과 달리 <br/>너비, 깊이, 해상도 모두 균형있게 확장되기 때문에<br/>
    낮은 파라미터수로 효율성이 높아 사용하였습니다.<br/><br/>최종적으로 EfficientNet 모델이 정확도, F1 score등 <br/>모든 면에서 우수하여 사용했습니다.`;

    const bodyText2 = `서버와 연결된 카메라로 영상데이터를 서버에 전송합니다.<br/><br/> 데이터를 분류 모델에 입력 가능하게 처리한 뒤 분류해 <br/>질병으로 확인될 시 양봉업자에게 메세지로 위험 경보를 <br/>전송해줍니다.`

    const bodyText3 = `꿀벌과 관련된 다양한 정보를 체계적으로 수집하고 <br/>이를 기반으로 GPT-4o-mini 모델을 세밀하게 튜닝하여<br/> 학습시켰습니다.<br/><br/> 학습된 모델은 API를 통해 프론트엔드에 통합되었으며, <br/>양봉업자분들이 질병에 관한 질문을 할 경우 신뢰할 수 <br/>있는 전문적인 답변을 제공할 수 있도록 설계되었습니다.<br/><br/> 특히, 이 모델은 꿀벌 질병에 대한 최신 데이터와 관련<br/> 문헌을 반영하여 답변의 정확성과 실효성을 높였으며,<br/> 양봉업자분들의 현장 문제 해결에 실질적인 도움을 줄<br/> 수 있도록 최적화되었습니다.`

    const [currentScreen, setCurrentScreen]= useState(0);
    const [showTopButton, setShowTopButton]= useState(false);

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

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {element.scrollIntoView({ behavior: 'smooth' });}
    };
    useEffect(() => {
        const handleScroll = () => {
            const service1Element = document.getElementById('service1');
            if (service1Element) {
                const {top} = service1Element.getBoundingClientRect();
                setShowTopButton(top < window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scroll({top:0, behavior:'smooth'});
    };

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

                <div className={style.service0}>
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
                    scrollToSection={scrollToSection}
                    />
                </div>
                <div id="service1" className={style.service1}>
                    <Servicebody
                        body_title={"BEE명소리 구성원"}
                        body_text={bodyText0}
                        body_foot={""}
                        body_imgs={[
                            "avatar1.png",
                            "avatar2.png",
                            "avatar3.png",
                            "avatar4.png",
                            "avatar5.png",
                        ]}/>
                </div>
                <div id="service2" className={style.service2}>
                    <Servicebody
                        body_title={"질병 이미지분류"}
                        body_text={bodyText1}
                        body_foot={"더 자세한 내용은 담당자의 이메일 jdy6610@naver.com 문의바랍니다. "}
                        body_imgs={[
                            "vgg16.png",
                            "efficient.png",
                            "compare.png",
                    ]}/>
                </div>
                <div id="service3" className={style.service3}>
                    <Servicebody
                        body_title={"질병 발생감시"}
                        body_text={bodyText2}
                        body_foot={"더 자세한 내용은 담당자의 이메일 bktpbktp@naver.com 문의바랍니다."}
                        body_imgs={[
                            "result_bee.jpg",
                            "video2.jpg",
                            
                        ]}/>
                </div>
                <div id="service4" className={style.service4}>
                    <Servicebody
                        body_title={"꿀벌 특화 Chatbot"}
                        body_text={bodyText3}
                        body_foot={"더 자세한 내용은 담당자의 이메일 joeunman11@naver.com 문의바랍니다."}
                        body_imgs={[
                            "beechat.png",
                            "chatbot1.png",
                            "chatbot2.png",
                        ]}/>
                </div>
                <div id="service5" className={style.service5}>
                    
                </div>
            </main>
            {showTopButton && (
                <button className={style.topButton} onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
}

export default Service;