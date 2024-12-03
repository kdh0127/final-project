import React from 'react';
import style from '../style/Service.module.css'
import Header from '../Header';

function Service(){
    

    return(
        <div className={style.service}>
            <Header />
            <main className={style.mainservice}>
                <div className={style.service1}>
                    <div className={style.title}>
                        <h4>Bee Careful Technology</h4>
                    </div>
                    <div className={style.article}>
                    <p>Bee Careful이 뛰어난 기술력을 바탕으로 함꼐하는 양봉업자들의 빛나는 내일을 열어줄 든든한 성장 파트너가 되겠습니다.</p>
                    </div>
                    <div className={style.content}>
                        <div className={style.box}>
                            <img src={process.env.PUBLIC_URL + '/image.png'} alt="이미지진단" />
                            <p className={style.box_title}>이미지 진단</p>
                            <p className={style.box_article}>꿀벌 사진만으로 질병여부 판단</p>
                        </div>
                        <div className={style.box}>
                            <img src={process.env.PUBLIC_URL + '/camera.png'} alt="감시시스템" />
                            <p className={style.box_title}>감시시스템</p>
                            <p className={style.box_article}>실시간 감시를 통해 질병 조기 진단</p>
                        </div>
                        <div className={style.box}>
                            <img src={process.env.PUBLIC_URL + '/chatbot.png'} alt="진단AI" />
                            <p className={style.box_title}>진단AI</p>
                            <p className={style.box_article}>간단한 질문으로 문재해결</p>
                        </div>
                    </div>
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