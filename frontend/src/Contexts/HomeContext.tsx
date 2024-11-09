import React, { createContext, useEffect, useState } from 'react';
import { getFeaturedEvents, getHeaderEvents, getTopRatedEvents, getUpcomingEvents } from '../api_service/HomeService';
import { Events } from '../interfaces/Event';


type Props = {
    children: React.ReactNode;
  };

interface HomeContextType {
    headerEvents: Events[];
    upcomingEvents: Events[];
    featuredEvents: Events[];
    topRatedEvents: Events[];
}

export const HomeCT = createContext<HomeContextType>({} as HomeContextType);

const HomeContexts = ({ children }: Props) => {
    const [headerEvents, setHeaderEvents] = useState<Events[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<Events[]>([]);
    const [topRatedEvents, setTopRatedEvents] = useState<Events[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setHeaderEvents(await getHeaderEvents());
                setUpcomingEvents(await getUpcomingEvents());
                setFeaturedEvents(await getFeaturedEvents());
                setTopRatedEvents(await getTopRatedEvents());
            } catch (error) {
                console.error("Error loading events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <HomeCT.Provider value={{
            headerEvents,
            upcomingEvents,
            featuredEvents,
            topRatedEvents
        }}>
            {children}
        </HomeCT.Provider>
    );
};
export default HomeContexts