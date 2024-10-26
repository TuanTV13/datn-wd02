// src/service/speakerService.js

const API_URL = 'http://your-api-url.com/api/speakers'; // Đổi URL theo API của bạn

// Lấy danh sách diễn giả
export const getSpeakers = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch speakers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching speakers:', error);
    throw error;
  }
};

// Thêm diễn giả mới
export const addSpeaker = async (speakerData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(speakerData),
    });

    if (!response.ok) throw new Error('Failed to add speaker');
    return await response.json();
  } catch (error) {
    console.error('Error adding speaker:', error);
    throw error;
  }
};

// Sửa diễn giả
export const updateSpeaker = async (speakerId, speakerData) => {
  try {
    const response = await fetch(`${API_URL}/${speakerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(speakerData),
    });

    if (!response.ok) throw new Error('Failed to update speaker');
    return await response.json();
  } catch (error) {
    console.error('Error updating speaker:', error);
    throw error;
  }
};

// Xóa diễn giả
export const deleteSpeaker = async (speakerId) => {
  try {
    const response = await fetch(`${API_URL}/${speakerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete speaker');
    return await response.json();
  } catch (error) {
    console.error('Error deleting speaker:', error);
    throw error;
  }
};
