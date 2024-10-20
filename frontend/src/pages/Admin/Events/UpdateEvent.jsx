import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { updateEvent, getEvent } from '../../../api_service/event'; // Import hàm updateEvent và getEvent
import ModalInfo from '../../../components/Admin/ErrorModal'; // Import ModalInfo
import AddSpeakerModal from '../../../components/Admin/AddSpeakerModal'; // Import AddSpeakerModal
import { getSpeakers, addSpeaker } from '../../../api_service/speaker'; // Import hàm getSpeakers và addSpeaker

const UpdateEvent = ({ eventId }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ show: false, message: '', type: '' });
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false);
  const [speakers, setSpeakers] = useState([]);

  const [speakerName, setSpeakerName] = useState('');
  const [speakerEmail, setSpeakerEmail] = useState('');
  const [speakerPhone, setSpeakerPhone] = useState('');
  const [speakerProfile, setSpeakerProfile] = useState('');
  const [speakerImageUrl, setSpeakerImageUrl] = useState('');

  const categories = [
    { id: 1, name: 'Hội thảo' },
    { id: 2, name: 'Buổi tọa đàm' },
    { id: 3, name: 'Khóa học' }
  ];

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image']
    ],
  };

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const data = await getEvent(eventId);
        setValue('name', data.name);
        setValue('eventType', data.eventType);
        setValue('startDate', data.startDate);
        setValue('endDate', data.endDate);
        setValue('participants', data.participants);
        setValue('location', data.location);
        setValue('zoomLink', data.zoomLink);
        setDescription(data.description);
        setThumbnail(null);
        setSelectedSpeakers(data.speakers || []);
        setValue('category', data.category); // Giả sử data.category chứa ID danh mục
      } catch (error) {
        setModalInfo({ show: true, message: 'Không thể tải dữ liệu sự kiện.', type: 'error' });
      }
    };

    loadEventData();
  }, [eventId, setValue]);

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
      await updateEvent(eventId, formData);
      setModalInfo({ show: true, message: 'Sự kiện đã được cập nhật thành công.', type: 'success' });
      resetForm();
    } catch (error) {
      setModalInfo({ show: true, message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.', type: 'error' });
    }
  };

  const resetForm = () => {
    reset();
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

  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        const data = await getSpeakers();
        setSpeakers(data);
      } catch (error) {
        setModalInfo({ show: true, message: 'Không thể tải danh sách diễn giả.', type: 'error' });
      }
    };

    loadSpeakers();
  }, []);

  const addNewSpeaker = async () => {
    if (speakerName && speakerEmail && speakerPhone) {
      try {
        const newSpeaker = await addSpeaker({
          name: speakerName,
          email: speakerEmail,
          phone: speakerPhone,
          profile: speakerProfile,
          image_url: speakerImageUrl
        });
        setSpeakers([...speakers, newSpeaker]);
        resetSpeakerForm();
        setShowAddSpeakerModal(false);
      } catch (error) {
        setModalInfo({ show: true, message: 'Không thể thêm diễn giả mới.', type: 'error' });
      }
    }
  };

  const resetSpeakerForm = () => {
    setSpeakerName('');
    setSpeakerEmail('');
    setSpeakerPhone('');
    setSpeakerProfile('');
    setSpeakerImageUrl('');
  };

  return (
    <div>
         <form className="mx-auto p-6 bg-white shadow-md rounded-lg" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-center mb-5">Thêm mới sự kiện</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Tên sự kiện */}
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

        {/* Loại hình sự kiện */}
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

        {/* Ngày bắt đầu */}
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

        {/* Ngày kết thúc */}
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

        {/* Số lượng tham gia */}
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

        {/* Diễn giả */}
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
                {speakers.map((speaker) => (
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

        {/* Địa điểm */}
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

        {/* Danh mục */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục</label>
          <select
            id="category"
            {...register('category', { required: 'Vui lòng chọn danh mục' })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Link Zoom */}
        <div>
          <label htmlFor="zoomLink" className="block text-sm font-medium text-gray-700">Link Zoom</label>
          <input
            type="url"
            id="zoomLink"
            {...register('zoomLink')}
            className={`mt-1 block w-full px-4 py-2 border ${errors.zoomLink ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.zoomLink && <p className="text-red-500 text-sm">{errors.zoomLink.message}</p>}
        </div>

        {/* Hình ảnh đại diện */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Hình ảnh đại diện</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
      </div>

      {/* Mô tả sự kiện */}
      <div className="mt-4">
  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả sự kiện</label>
  <ReactQuill
    theme="snow"
    value={description}
    onChange={setDescription}
    modules={modules}
    className="mt-1 border border-gray-300 rounded-md"
  />
</div>

      {/* Nút gửi */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
        >
          Thêm sự kiện
        </button>
      </div>
    </form>

      {/* Modal thông báo lỗi */}
      <ModalInfo show={modalInfo.show} message={modalInfo.message} type={modalInfo.type} onClose={() => setModalInfo({ show: false })} />
      {/* Modal thêm diễn giả */}
      <AddSpeakerModal show={showAddSpeakerModal} onClose={() => setShowAddSpeakerModal(false)} onAddSpeaker={addNewSpeaker} speakerName={speakerName} setSpeakerName={setSpeakerName} speakerEmail={speakerEmail} setSpeakerEmail={setSpeakerEmail} speakerPhone={speakerPhone} setSpeakerPhone={setSpeakerPhone} speakerProfile={speakerProfile} setSpeakerProfile={setSpeakerProfile} speakerImageUrl={speakerImageUrl} setSpeakerImageUrl={setSpeakerImageUrl} />
    </div>
  );
};

export default UpdateEvent;
