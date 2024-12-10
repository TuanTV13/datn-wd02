{/* Popup hiển thị Vé */}
{showTickets && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={(e) => {
    // Kiểm tra nếu click không nằm trong nội dung popup
    if (e.target === e.currentTarget) {
      setShowTickets(false);
    }
  }}>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full h-auto max-h-[90vh] overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Thông tin Vé</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 bg-gray-50 rounded-lg shadow-md"
            >
              <p className="font-semibold text-gray-800">
                Loại vé: {ticket.ticket_type}
              </p>
              <p className="text-gray-600">Giá: {ticket.price} VND</p>
              <p className="text-gray-600">Số lượng: {ticket.quantity}</p>
              <p className="text-gray-600">
                Khu vực: {ticket.seat_location}
              </p>
              <p className="text-gray-600">
                Ngày mở bán: {new Date(ticket.sale_start).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Ngày kết thúc bán:{" "}
                {new Date(ticket.sale_end).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center">
            Chưa có thông tin vé
          </p>
        )}
      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4 text-center">Biểu đồ</h2>
      <div className="flex justify-center mb-6">
        <div className="w-1/3 max-w-sm">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          onClick={() => setShowTickets(false)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}


      {/* Popup hiển thị Người dùng */}
      {showUsers && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={(e) => {
    // Kiểm tra nếu click không nằm trong nội dung popup
    if (e.target === e.currentTarget) {
      setShowUsers(false);
    }
  }}>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full h-auto max-h-[80vh] overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Người đã mua vé</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ID người dùng</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mã vé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái check-in</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.pivot.user_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.ticket_code}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      user.pivot.checked_in === 1 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.pivot.checked_in === 1 ? "Đã check-in" : "Chưa check-in"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                  <td className="border border-gray-300 px-4 py-2 text-center">
  <button
    onClick={() => {
      // Kiểm tra trạng thái của user để gọi hàm phù hợp
      if (user.pivot.checked_in === 1) {
        handleCancelCheckIn(user.id, user.ticket_code);
      } else {
        handleCheckIn(user.id, user.ticket_code);
      }
    }}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-[150px] ${
      user.pivot.checked_in === 1
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    {user.pivot.checked_in === 1 ? "Hủy check-in" : "Check-in"}
  </button>
</td>


                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  Chưa có người mua vé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-right mt-4">
        <button
          onClick={() => setShowUsers(false)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}