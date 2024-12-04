import React from 'react';
import style from './style/Screen.module.css';

const Screen = ({ header, subheader, title, article, more, imageUrl }) => {
  return (
    <div className={style.Screen}>
      <div className={style.leftbody}>
        <div className={style.header}>{header}</div>
        <div className={style.subheader}>{subheader}</div>
        <div className={style.title}>{title}</div>
        <div className={style.article}>{article}</div>
        <div className={style.more}>
            <button className={style.more_button}>{more}</button></div>
      </div>
      <div className={style.rightbody}>
        <img src={imageUrl} alt="Dynamic" className={style.image} />
      </div>
    </div>
  );
};

export default Screen;