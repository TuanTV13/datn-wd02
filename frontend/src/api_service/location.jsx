// file: service/location-service.js

import axios from 'axios';

const API_URL = 'http://192.168.2.112:8000/api/v1';

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(`${API_URL}/locations/provinces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Không thể tải danh sách tỉnh/thành phố');
  }
};

export const fetchDistricts = async (provinceId) => {
  try {
    const response = await axios.get(`${API_URL}/locations/districts/${provinceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Không thể tải danh sách quận/huyện');
  }
};

export const fetchWards = async (districtId) => {
  try {
    const response = await axios.get(`${API_URL}/locations/wards/${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw new Error('Không thể tải danh sách xã/phường');
  }
};
