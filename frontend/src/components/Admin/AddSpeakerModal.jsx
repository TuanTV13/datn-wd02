import React from 'react';
import { useForm } from 'react-hook-form';

const AddSpeakerModal = ({ show, addNewSpeaker, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    addNewSpeaker(data);
    onClose(); // Đóng modal sau khi thêm diễn giả
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-md shadow-lg">
        <h3 className="text-lg font-semibold">Thêm diễn giả mới</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register('speakerName', { required: 'Tên diễn giả là bắt buộc' })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${errors.speakerName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Tên diễn giả"
          />
          {errors.speakerName && <p className="text-red-500">{errors.speakerName.message}</p>}

          <input
            type="email"
            {...register('speakerEmail', { required: 'Email diễn giả là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${errors.speakerEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Email diễn giả"
          />
          {errors.speakerEmail && <p className="text-red-500">{errors.speakerEmail.message}</p>}

          <input
            type="tel"
            {...register('speakerPhone', { required: 'Số điện thoại là bắt buộc' })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${errors.speakerPhone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Số điện thoại diễn giả"
          />
          {errors.speakerPhone && <p className="text-red-500">{errors.speakerPhone.message}</p>}

          <input
            type="text"
            {...register('speakerProfile')}
            className="mt-2 block w-full border rounded-md shadow-sm p-3 text-lg border-gray-300"
            placeholder="Mô tả diễn giả"
          />

          <input
            type="url"
            {...register('speakerImageUrl', { required: 'Link ảnh diễn giả là bắt buộc', pattern: { value: /^(http|https):\/\/[^ "]+$/, message: 'Link không hợp lệ' } })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${errors.speakerImageUrl ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Link ảnh diễn giả"
          />
          {errors.speakerImageUrl && <p className="text-red-500">{errors.speakerImageUrl.message}</p>}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-gray-300 py-2 px-4 rounded-md"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpeakerModal;
