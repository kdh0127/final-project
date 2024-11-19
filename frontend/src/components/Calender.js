import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import style from '../style/Calender.module.css';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null); // 클릭된 이벤트 상태

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vet_schedule');
        const data = await response.json();

        const formattedEvents = data.map((item, index) => {
          const eventDate = new Date(item.date);
          const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);
          return {
            id: index.toString(), // id를 문자열로 설정
            title: item.name,
            start: eventDate.toISOString(),
            end: endDate.toISOString(),
            description: item.description || '',
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('이벤트를 가져오는 데 오류가 발생했습니다.', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault(); // 기본 동작 방지
    if (activeEvent === info.event.id) {
      setActiveEvent(null);
    } else {
      setActiveEvent(info.event.id);
    }
  };

  return (
    <div className={style.calendar}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={(eventInfo) => (
          <div className={style.eventContainer}>
            <b>{eventInfo.event.title}</b>
            {activeEvent === eventInfo.event.id && (
              <div className={style.dropdown}>
                <p>{eventInfo.event.extendedProps.description}</p>
              </div>
            )}
          </div>
        )}
        eventClick={handleEventClick} 
      />
    </div>
  );
}
