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
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const headerData = await getHeaderEvents();
                const upcomingData = await getUpcomingEvents();
                const featuredData = await getFeaturedEvents();
                const topRatedData = await getTopRatedEvents();

                setHeaderEvents(headerData);
                setUpcomingEvents(upcomingData);
                setFeaturedEvents(featuredData);
                setTopRatedEvents(topRatedData);
            } catch (err) {
                setError("Error loading events.");
                console.error("Error loading events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
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
