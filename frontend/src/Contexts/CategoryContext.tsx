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
  fetchEventsByCategory: (categoryId: number | string) => Promise<void>
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

  const fetchEventsByCategory = async (categoryId: number | string) => {
    setLoading(true);
    try {
      const eventData = await getEventsByCategory(categoryId);
      setEvents(eventData);
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
      }}
    >
      {children}
    </CategoryCT.Provider>
  );
};

export default CategoryContexts;
