import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Events } from '../interfaces/Event';
import {  getAllEvents, GetAllProvinces, getEventById } from '../api_service/ClientEvent';

type Props = {
  children: ReactNode;
};

interface EventContextType {
  events: Events[];
  eventDetails: Events | null;
  loading: boolean;
  fetchEventById: (id: number) => Promise<void>;
  setEvents: React.Dispatch<React.SetStateAction<Events[]>>;
  provinces: any[]
}

export const EventCT = createContext<EventContextType>({} as EventContextType);

const EventContexts = ({ children }: Props) => {
  const [events, setEvents] = useState<Events[]>([]);
  const [eventDetails, setEventDetails] = useState<Events | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState([]);

  // Lấy tất cả sự kiện
  useEffect(() => {
    (async () => {
      const data = await getAllEvents()
      setEvents(data)
    })()
  },[])

    // Lấy tất cả provinces
    useEffect(() => {
      (async () => {
        const data = await GetAllProvinces()
        setProvinces(data)
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


  return (
    <EventCT.Provider
      value={{
        events,
        eventDetails,
        loading,
        fetchEventById,
        setEvents,
        provinces
      }}
    >
      {children}
    </EventCT.Provider>
  );
};

export default EventContexts;
