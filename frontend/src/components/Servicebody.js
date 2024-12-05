import React, { useState } from 'react';
import style from './style/Servicebody.module.css';

const Servicebody = ({body_title, body_text, body_foot, body_imgs}) => {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const handleNextImage = () => { setCurrentImageIndex((prevIndex) => (prevIndex+1) % body_imgs.length);
    };
    const handlePrevImage= () => { setCurrentImageIndex((prevIndex) => (prevIndex - 1 + body_imgs.length) % body_imgs.length);
    };

    return (
        <div className={style.servicebody}>
            <div className={style.headbody}>
                <div className={style.body_title}>
                    {body_title}
                </div>
                <div className={style.body_button_container}>
                    <button 
                        className={style.body_button} 
                        onClick={handlePrevImage}>
                            &lt; 
                    </button>
                    <button 
                        className={style.body_button} 
                        onClick={handleNextImage}>
                             &gt;
                    </button>
                </div>
            </div>
            <div className={style.mainbody}>
                <div className={style.leftbody}>
                    <div className={style.body_text}>
                        <p dangerouslySetInnerHTML={{ __html: body_text }}></p>
                    </div>
                    <div className={style.body_foot}>
                        {body_foot}
                    </div>
                </div>
                <div className={style.rightbody}>
                    <img src={body_imgs[currentImageIndex]} alt={`이미지${currentImageIndex}`} className={style.body_img} />
                </div>
            </div>
        </div>
    );
};

export default Servicebody;