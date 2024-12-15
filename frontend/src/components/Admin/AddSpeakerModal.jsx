import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // for making HTTP requests to Cloudinary
import axiosInstance from "../../axios";

const AddSpeakerModal = ({ show, addNewSpeaker, onClose: close, eventId }) => {
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const [uploading, setUploading] = useState(false); // To show a loading state during upload
  const {
    register,
    handleSubmit,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm();
  const onClose = () => {
    resetField();
    clearErrors();
    close();
  };
  const onSubmit = async (data) => {
    if (imageFile) {
      setUploading(true); // Start uploading

      try {
        // Create a FormData object to upload the file
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default"); // Add your Cloudinary preset
        formData.append("cloud_name", "wang14123"); // Add your Cloudinary cloud name

        // Make the POST request to Cloudinary
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/wang14123/image/upload",
          formData
        );
        const imageUrl = response.data.secure_url; // Get the uploaded image URL

        // Add the image URL to the form data
        const formDataWithImage = {
          ...data,
          image_url: imageUrl, // Add the image URL
        };

        // Submit the form data (with the image URL)
        await axiosInstance.put(`events/${eventId}/addSpeaker`, {
          ...formDataWithImage,
          event_id: eventId,
        });
        onClose(); // Close the modal after adding the speaker
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false); // Stop uploading
        onClose();
      }
    } else {
      // If no image selected, submit the form without the image
      // addNewSpeaker(data);
      onClose();
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white w-full max-w-screen-md p-5 rounded-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Thêm diễn giả mới</h3>

        <form
          className="px-20 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register("name", {
              required: "Tên diễn giả là bắt buộc",
            })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tên diễn giả"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="email"
            {...register("email", {
              required: "Email diễn giả là bắt buộc",
              pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" },
            })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email diễn giả"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <input
            type="tel"
            {...register("phone", {
              required: "Số điện thoại là bắt buộc",
            })}
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Số điện thoại diễn giả"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}

          <input
            type="text"
            {...register("profile")}
            className="mt-2 block w-full border rounded-md shadow-sm p-3 text-lg border-gray-300"
            placeholder="Mô tả diễn giả"
          />

          <input
            type="file"
            onChange={handleImageChange} // Set the selected image file
            className={`mt-2 block w-full border rounded-md shadow-sm p-3 text-lg ${
              errors.image_url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image_url && (
            <p className="text-red-500">{errors.image_url.message}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={uploading} // Disable the button while uploading
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {uploading ? "Đang tải lên..." : "Thêm"}
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
