import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // 서버에서 승낙된 진료 일정 데이터를 가져옴
        const response = await fetch('http://localhost:5000/api/vet_schedule');
        const data = await response.json();

        // 데이터 가공: FullCalendar가 이해할 수 있는 형식으로 변환
        const formattedEvents = data.map((item) => ({
          title: item.name, // 이벤트 제목 (이름)
          start: item.date, // 백엔드에서 받은 시간 데이터 그대로 사용
          end: new Date(new Date(item.date).getTime() + 60 * 60 * 1000).toISOString(),
          description: item.description || '',
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('이벤트를 가져오는 데 오류가 발생했습니다.', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin]} // 플러그인 설정
        initialView="dayGridMonth" // 기본 뷰 설정
        events={events} // 캘린더에 표시할 일정 데이터
        eventContent={(eventInfo) => (
          // 커스텀 이벤트 콘텐츠 렌더링 (필요시)
          <div>
            <b>{eventInfo.event.title}</b>
            <p>{eventInfo.event.extendedProps.description}</p>
            <p>{new Date(eventInfo.event.start).toLocaleString()}</p> {/* 날짜와 시간 표시 */}
          </div>
        )}
      />
    </div>
  );
}
