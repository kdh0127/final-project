import * as React from 'react';
import style from '../style/Support.module.css';
import Header from '../Header';
import Card from '../Card';
import { Link } from "react-router-dom";

function Support() {

    return(
        <div className={style.container}>
            <Header/>
            <main className={style.main_support}>
                <div className={style.top_body}>
                    <div className={style.top_left_body}>
                        <div className={style.title}>
                            <h3> 안녕하세요, BEE CAREFUL 고객센터 입니다. <br/> 무엇을 도와드릴까요? </h3>
                        </div>
                        <div className={style.text}>
                            <span>밑에 아이콘을 통해 필요한 서비스를 이용해주세요.<br/>여러가지 요청을 빠르게 처리해드리겠습니다.</span>
                        </div>
                    </div>
                    <div className={style.top_right_body}>
                        <img src="support_icon.png" alt="라이트바디" className={style.top_right_body_img} />                        
                    </div>
                </div>
                <div className={style.bottom_body}>
                    <Link to="/support-service" className={style.link_style}>
                        <Card
                        title={"서비스 개발"}
                        icon={"support1.png"}
                        />
                    </Link>
                    <Link to="/support-service" className={style.link_style}>
                        <Card
                        title={"서비스 개선"}
                        icon={"support2.png"}
                        />
                    </Link>
                    <Link to="/support-service" className={style.link_style}>
                        <Card
                        title={"계정정보 수정"}
                        icon={"support3.png"}
                        />
                    </Link>
                    <Link to="/support-partner" className={style.link_style }>
                        <Card
                        title={"협력 파트너"}
                        icon={"support4.png"}
                        />
                    </Link>
                    <Link to="/support-service" className={style.link_style}>
                        <Card
                        title={"기타사항"}
                        icon={"support5.png"}
                        />
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Support;