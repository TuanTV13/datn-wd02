import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Events } from '../interfaces/Event';
import { checkInEvent, getAllEvents, getEventById } from '../api_service/ClientEvent';

type Props = {
  children: ReactNode;
};

interface EventContextType {
  events: Events[];
  eventDetails: Events | null;
  loading: boolean;
  fetchEventById: (id: number) => Promise<void>;
  checkInToEvent: (eventId: number) => Promise<any>;
  setEvents: React.Dispatch<React.SetStateAction<Events[]>>;
}

export const EventCT = createContext<EventContextType>({} as EventContextType);

const EventContexts = ({ children }: Props) => {
  const [events, setEvents] = useState<Events[]>([]);
  const [eventDetails, setEventDetails] = useState<Events | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy tất cả sự kiện
  useEffect(() => {
    (async () => {
      const data = await getAllEvents()
      setEvents(data)
    })()
  },[])

  // Lấy chi tiết sự kiện theo ID
  const fetchEventById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getEventById(id);
      setEventDetails(data);
    } catch (error) {
      console.error("Lỗi khi tải sự kiện theo ID:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check-in vào sự kiện
  const checkInToEvent = async (eventId: number) => {
    setLoading(true);
    try {
      const data = await checkInEvent(eventId);
      return data; // trả về dữ liệu nếu muốn sử dụng nó trực tiếp
    } catch (error) {
      console.error("Lỗi khi check-in sự kiện:", error);
      throw error; // Ném lỗi ra ngoài nếu muốn xử lý ở nơi khác
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventCT.Provider
      value={{
        events,
        eventDetails,
        loading,
        fetchEventById,
        checkInToEvent,
        setEvents,
      }}
    >
      {children}
    </EventCT.Provider>
  );
};

export default EventContexts;
