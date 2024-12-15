import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAllCategory, getEventsByCategory } from '../api_service/ClientEvent';
import { Categories } from '../interfaces/Categories';
import { Events } from '../interfaces/Event';

type Props = {
  children: ReactNode;
};

interface CategoryContextType {
  categories: Categories[];
  events: Events[];
  loading: boolean
  fetchEventsByCategory: (id: number | string) => Promise<void>
  setEvents: React.Dispatch<React.SetStateAction<Events[]>>;
}

export const CategoryCT = createContext<CategoryContextType>({} as CategoryContextType);

const CategoryContexts = ({ children }: Props) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all categories on initial load
  useEffect(() => {
    (async () => {
      const data = await getAllCategory();
      setCategories(data);
    })();
  }, []);

  const fetchEventsByCategory = async (id: number | string) => {
    setLoading(true);
    try {
      const eventData = await getEventsByCategory(id);
      setEvents(eventData);
      console.log(eventData)
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CategoryCT.Provider
      value={{
        categories,
        loading,
        events,
        fetchEventsByCategory,
        setEvents
      }}
    >
      {children}
    </CategoryCT.Provider>
  );
};

export default CategoryContexts;
