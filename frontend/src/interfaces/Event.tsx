export interface Events {
  id: number | string;
  category_id: number;
  province_id: number;
  district_id: number;
  ward_id: number;
  name: string;
  description: string;
  thumbnail: string;
  start_time: string;
  end_time: string;
  location: string;
  event_type: string;
  link_online: string;
  max_attendees: number;
  registed_attendees: number;
  created_at: string;
}
