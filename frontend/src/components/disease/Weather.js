import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherComponent = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  console.log("API_KEY:", API_KEY);

  const [weather, setWeather] = useState({
    description: "",
    name: "",
    temp: 0,
    icon: "",
  });
  const [error, setError] = useState("");

  const weatherDescKo = {
    200: "가벼운 비를 동반한 뇌우",
    201: "비를 동반한 뇌우",
    202: "강한 비를 동반한 뇌우",
    800: "맑음",
    // 추가적인 날씨 ID 및 설명을 매핑
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeather(lat, lon);
      },
      (err) => {
        console.error(err);
        setError("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  const getWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const weatherId = res.data.weather[0].id;
      const weatherKo = weatherDescKo[weatherId] || "알 수 없는 날씨";
      const weatherIcon = res.data.weather[0].icon;
      const weatherIconAdrs = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      const temp = Math.round(res.data.main.temp);
      const cityName = res.data.name;

      setWeather({
        description: weatherKo,
        name: cityName,
        temp: temp,
        icon: weatherIconAdrs,
      });
    } catch (err) {
      console.error(err);
      setError("날씨 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.description}</p>
          <p>{weather.temp}°C</p>
          <img src={weather.icon} alt={weather.description} />
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
