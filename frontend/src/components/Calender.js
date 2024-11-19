import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import style from '../style/Calender.module.css';

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // 서버에서 승낙된 진료 일정 데이터를 가져옴
        const response = await fetch('http://localhost:5000/api/vet_schedule');
        const data = await response.json();

        // 데이터 가공: FullCalendar가 이해할 수 있는 형식으로 변환
        const formattedEvents = data.map((item) => {
          const eventDate = new Date(item.date); // 날짜를 Date 객체로 변환
          const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1시간 후로 설정

          return {
            title: item.name, // 이벤트 제목 (이름)
            start: eventDate.toISOString(), // 시작 날짜
            end: endDate.toISOString(), // 종료 날짜
            description: item.description || '', // 설명 (없을 경우 빈 문자열)
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('이벤트를 가져오는 데 오류가 발생했습니다.', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={style.calendar}>
      <FullCalendar
        plugins={[dayGridPlugin]} // 플러그인 설정
        initialView="dayGridMonth" // 기본 뷰 설정
        events={events} // 캘린더에 표시할 일정 데이터
        eventContent={(eventInfo) => (
          // 커스텀 이벤트 콘텐츠 렌더링 (필요시)
          <div>
            <b>{eventInfo.event.title}</b>
            <p>{eventInfo.event.extendedProps.description}</p>
          </div>
        )}
      />
    </div>
  );
}
