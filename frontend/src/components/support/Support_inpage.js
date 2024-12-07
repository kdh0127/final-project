import React from 'react';
import style from '../style/Support_inpage.module.css';
import Header from '../Header';

function Support_inpage(){
    return(
        <div className={style.Support_inpage}>
            <Header/>
            <main className={style.mainbox}>
                <div className={style.top}>
                    <div className={style.title}>
                        <h2>예시1</h2>
                        <span>BEE CAREFUL 고객센터에 제안하실 의견을 접수해 주세요.</span>
                    </div>
                </div>
                <div className={style.middle1}>
                    <ul className={style.ul}>
                        <li>제안주신 내용에 대한 결과는 이메일로 안내해드리고 있습니다.</li>
                        <li>원하시는 요청사항의 내용을 자세하게 적어주시면 감사하겠습니다.</li>
                        <li>보내주신 다양한 의견은 더 나은 BEE CAREFUL이 되기 위해 소중히 활용하고 있습니다.</li>
                    </ul>
                </div>
                <div className={style.middle2}>
                    <p>BEE CAREFUL 고객센터는 산업안전보건법을 준수하여 담당자를 보호하고 있습니다. <br/>
                    성희롱, 욕설 등의 폭언을 하지 말아주세요. <br/>
                    폭언 시 상담이 제한되고 법령에 따라 조치될 수 있습니다.</p>
                </div>
                <div className={style.bottom}>

                </div>
            </main>
        </div>
    )
};

export default Support_inpage