import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const mockSpeakers = [
  { id: 1, name: 'Diễn giả 1' },
  { id: 2, name: 'Diễn giả 2' },
  { id: 3, name: 'Diễn giả 3' },
];

const AddEvent = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ show: false, message: '', type: '' });
  const [speakerName, setSpeakerName] = useState('');
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false);

  const categories = ['Hội thảo', 'Buổi tọa đàm', 'Khóa học', 'Chương trình giao lưu', 'Khác'];

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    formData.append('speakers', JSON.stringify(selectedSpeakers));

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData);
      setModalInfo({ show: true, message: 'Sự kiện đã được thêm thành công.', type: 'success' });
      resetForm();
    } catch (error) {
      setModalInfo({ show: true, message: error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.', type: 'error' });
    }
  };

  const resetForm = () => {
    setValue('name', '');
    setValue('eventType', '');
    setValue('startDate', '');
    setValue('endDate', '');
    setValue('participants', '');
    setValue('location', '');
    setValue('zoomLink', '');
    setValue('category', '');
    setDescription('');
    setThumbnail(null);
    setSelectedSpeakers([]);
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const toggleSpeakerSelection = (speakerId) => {
    if (selectedSpeakers.includes(speakerId)) {
      setSelectedSpeakers(selectedSpeakers.filter((id) => id !== speakerId));
    } else {
      setSelectedSpeakers([...selectedSpeakers, speakerId]);
    }
  };

  const addNewSpeaker = () => {
    if (speakerName) {
      mockSpeakers.push({ id: mockSpeakers.length + 1, name: speakerName });
      setSpeakerName('');
      setShowAddSpeakerModal(false);
    }
  };

  return (
    <div>
      <form className="mx-auto p-6 bg-white shadow-md rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold text-center mb-5">Thêm mới sự kiện</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Tên sự kiện</label>
            <input
              type="text"
              id="event-name"
              {...register('name', { required: 'Tên sự kiện là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
               <label htmlFor="speakers" className="block text-sm font-medium text-gray-700">Diễn giả</label>
               <div className="relative mt-1">
               <button
                  type="button"
                  className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               >
                  Chọn diễn giả
               </button>

               {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                     {mockSpeakers.map((speaker) => (
                     <li
                        key={speaker.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleSpeakerSelection(speaker.id)}
                     >
                        <input
                           type="checkbox"
                           className="mr-2"
                           checked={selectedSpeakers.includes(speaker.id)}
                           readOnly
                        />
                        {speaker.name}
                     </li>
                     ))}
                  </ul>
               )}
               </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowAddSpeakerModal(true)}
                className="text-blue-500 hover:underline"
              >
                Thêm mới diễn giả
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm</label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Địa điểm tổ chức là bắt buộc' })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
        >
          Thêm sự kiện
        </button>
      </form>

      {/* Modal hiển thị thông báo */}
      {modalInfo.show && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className={`text-lg font-bold ${modalInfo.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {modalInfo.message}
            </h2>
            <button onClick={() => setModalInfo({ ...modalInfo, show: false })} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Popup thêm diễn giả mới */}
      {showAddSpeakerModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-lg font-bold">Thêm diễn giả mới</h2>
            <input
              type="text"
              value={speakerName}
              onChange={(e) => setSpeakerName(e.target.value)}
              placeholder="Tên diễn giả"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              onClick={addNewSpeaker}
              className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
            >
              Thêm
            </button>
            <button
              onClick={() => setShowAddSpeakerModal(false)}
              className="mt-2 w-full py-2 bg-gray-200 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEvent;


