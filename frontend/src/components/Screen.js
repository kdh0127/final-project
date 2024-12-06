import React from 'react';
import style from './style/Screen.module.css';

const Screen = ({ header, subheader, title, article, more, imageUrl, screens, currentScreen, setCurrentScreen, scrollToSection }) => {
  return (
    <div className={style.Screen}>
      <div className={style.leftbody}>
        <div className={style.header}>{header}</div>
        <div className={style.subheader}>{subheader}</div>
        <div className={style.title}>{title}</div>
        <div className={style.article}>{article}</div>
        <div className={style.more}>
            <button className={style.more_button} onClick={() => scrollToSection(`service${currentScreen +1}`)}>{more}</button></div>
      </div>
      <div className={style.rightbody}>
        <img src={imageUrl} alt="Dynamic" className={style.image} />
      </div>
      <div className={style.navbar}>
        {screens.map((_, index) => (
          <button
          key={index}
          className={`${style.navbutton} ${currentScreen === index ? style.active : ''}`}
          onClick={() => setCurrentScreen(index)}>
          <span className={style.dot}></span>
        </button>
        ))}
      </div>
    </div>
  );
};

export default Screen;