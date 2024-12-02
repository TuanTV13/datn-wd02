import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { getFeaturedEvents, getHeaderEvents, getTopRatedEvents, getUpcomingEvents } from '../api_service/HomeService';
import { Events } from '../interfaces/Event';

type Props = {
    children: ReactNode;
};

interface HomeContextType {
    headerEvents: Events[];
    upcomingEvents: Events[];
    featuredEvents: Events[];
    topRatedEvents: Events[];
    loading: boolean;
    error: string | null;
}

export const HomeCT = createContext<HomeContextType>({} as HomeContextType);

const HomeContexts = ({ children }: Props) => {
    const [headerEvents, setHeaderEvents] = useState<Events[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Events[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<Events[]>([]);
    const [topRatedEvents, setTopRatedEvents] = useState<Events[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
          const data = await getHeaderEvents();
          setHeaderEvents(data);
        })();
      }, []);

      useEffect(() => {
        (async () => {
          const data = await getUpcomingEvents();
          setUpcomingEvents(data);
        })();
      }, []);

      useEffect(() => {
        (async () => {
            const data = await getFeaturedEvents();
            setFeaturedEvents(data);
        })();
      }, []);

      useEffect(() => {
        (async () => {
            const data = await getTopRatedEvents();
            setTopRatedEvents(data);
        })();
      }, []);
    return (
        <HomeCT.Provider value={{
            headerEvents,
            upcomingEvents,
            featuredEvents,
            topRatedEvents,
            loading,
            error,
        }}>
            {children}
        </HomeCT.Provider>
    );
};

export default HomeContexts;
