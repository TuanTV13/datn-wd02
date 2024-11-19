// file: service/location-service.js

import axios from 'axios';

const API_URL = 'http://10.24.16.19:8000/api/v1';

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(`https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`);
   
    
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Không thể tải danh sách tỉnh/thành phố');
  }
};

export const fetchDistricts = async (provinceCode) => {
  try {
    const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
    console.log(response.data);
    return response.data;  // Giả sử dữ liệu trả về chứa danh sách quận/huyện trong trường 'data'
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Không thể tải danh sách quận/huyện');
  }
};


export const fetchWards = async (districtCode) => {
  try {
    const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw new Error('Không thể tải danh sách xã/phường');
  }
};