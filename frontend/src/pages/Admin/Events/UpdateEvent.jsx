import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS for Quill
import axios from 'axios';
import { useForm } from 'react-hook-form';

const UpdateEvent = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  // Mock data cho sự kiện
  const mockEventData = {
    eventName: 'Hội thảo về công nghệ',
    eventType: 'Offline',
    startDate: '2024-11-01',
    endDate: '2024-11-02',
    participants: 100,
    speaker: 'Nguyễn Văn A',
    location: 'Hà Nội',
    zoomLink: '',
    category: 'Hội thảo',
    description: '<p>Đây là một hội thảo rất thú vị về công nghệ.</p>',
  };

  useEffect(() => {
    // Đặt giá trị mặc định cho form khi component mount
    Object.entries(mockEventData).forEach(([key, value]) => {
      setValue(key, value);
    });
    setDescription(mockEventData.description);
  }, [setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      // Gửi formData đến server (thay đổi URL cho phù hợp với API của bạn)
      const response = await axios.put('YOUR_API_URL', formData);
      alert('Cập nhật sự kiện thành công!'); // Hiện thông báo thành công
      console.log('Cập nhật thành công:', response.data);
    } catch (error) {
      alert('Có lỗi xảy ra trong quá trình cập nhật sự kiện!'); // Hiện thông báo lỗi
      console.error('Cập nhật thất bại:', error);
    }
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  return (
    <div>
      <form className="mx-auto p-6 bg-white shadow-md rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold text-center mb-5">Cập nhật sự kiện</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Tên sự kiện</label>
            <input
              type="text"
              id="event-name"
              {...register('eventName', { required: 'Tên sự kiện là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName.message}</p>}
          </div>

          <div>
            <label htmlFor="event-type" className="block text-sm font-medium text-gray-700">Loại hình sự kiện</label>
            <select
              id="event-type"
              {...register('eventType', { required: 'Vui lòng chọn loại hình sự kiện' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.eventType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Chọn loại hình</option>
              <option value="Online">Trực tuyến</option>
              <option value="Offline">Trực tiếp</option>
            </select>
            {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType.message}</p>}
          </div>

          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <input
              type="date"
              id="start-date"
              {...register('startDate', { required: 'Ngày bắt đầu là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
            <input
              type="date"
              id="end-date"
              {...register('endDate', { required: 'Ngày kết thúc là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>

          <div>
            <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Số lượng tham gia</label>
            <input
              type="number"
              id="participants"
              {...register('participants', { required: 'Số lượng tham gia là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.participants ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.participants && <p className="text-red-500 text-sm">{errors.participants.message}</p>}
          </div>

          <div>
            <label htmlFor="speaker" className="block text-sm font-medium text-gray-700">Diễn giả</label>
            <input
              type="text"
              id="speaker"
              {...register('speaker', { required: 'Tên diễn giả là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.speaker ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Tên diễn giả"
            />
            {errors.speaker && <p className="text-red-500 text-sm">{errors.speaker.message}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm</label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Địa điểm tổ chức là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Địa điểm tổ chức"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="zoom-link" className="block text-sm font-medium text-gray-700">Link Zoom (nếu có)</label>
            <input
              type="url"
              id="zoom-link"
              {...register('zoomLink')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://zoom.us/j/123456789"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select
              id="category"
              {...register('category', { required: 'Vui lòng chọn danh mục' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Chọn danh mục</option>
              <option value="Hội thảo">Hội thảo</option>
              <option value="Khóa học">Khóa học</option>
              <option value="Giao lưu">Giao lưu</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Hình đại diện</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
            <ReactQuill value={description} onChange={setDescription} />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
