export interface Events {
  id: number | string;
  category_id: number | string;
  category_name: string;
  province: string;
  district: string;
  ward: string;
  name: string;
  description: string;
  thumbnail: string;
  start_time: string;
  end_time: string;
  location: string;
  event_type: string;
  status: string
  link_online: string;
  max_attendees: number;
  speakers?:
    | {
        name: string;
        email: string;
      }[]
    | undefined;
  registed_attendees: number;
  created_at: string;
  category?: {
    id: number | string;
    name: string;
  };
}
