import React from 'react'

const AddTicket = () => {
  return (
    <div>
          <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-5">Thêm mới vé</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label htmlFor="ticket-code" className="block text-sm font-medium text-gray-700">Mã vé</label>
                <input type="text" id="ticket-code" value="ADCB234" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div>
                <label htmlFor="ticket-price" className="block text-sm font-medium text-gray-700">Giá vé</label>
                <input type="text" id="ticket-price" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div>
                <label htmlFor="event" className="block text-sm font-medium text-gray-700">Sự kiện</label>
                <select id="event" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Chọn sự kiện</option>
                </select>
              </div>

              <div>
                <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-700">Loại vé</label>
                <select id="ticket-type" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Chọn loại vé</option>
                </select>
              </div>

              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                <input type="date" id="start-date" placeholder="dd/mm/yyyy" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                <input type="date" id="end-date" placeholder="dd/mm/yyyy" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea id="description" rows={3} placeholder="Mô tả của bạn ....." className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-start space-x-4">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Lưu
              </button>
              <button type="button" className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Quay lại
              </button>
            </div>
      </form>
    </div>
  )
}

export default AddTicket
