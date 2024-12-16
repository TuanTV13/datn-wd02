import React from "react";

const Introduce = () => {
  return (
    <div className="mt-36">
      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Chúng tôi là một nhóm yêu thích hỗ trợ cộng đồng thông qua các sự
            kiện
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="">
          <h2 className="text-3xl font-bold mb-4">
            Mục tiêu của chúng tôi là cung cấp giải pháp bán vé sự kiện mạnh mẽ,
            chi phí hợp lý và phù hợp với quy mô và độ phức tạp của tất cả các
            loại hình sự kiện
          </h2>
        </div>
        <div className="">
          <p className="text-lg mb-4">
            Phần mềm bán vé sự kiện trực tuyến của SanSuKien được xây dựng trên
            ý tưởng rằng bất kỳ ai, ở bất kỳ đâu trên thế giới muốn tổ chức một
            sự kiện đều sẽ có các công cụ để thực hiện việc đó một cách đơn
            giản. Chúng tôi thúc đẩy ý tưởng này hàng ngày thông qua sự cống
            hiến của một nhóm có trụ sở tại một huyện ngoại thành Hồ Chí Minh,
            Việt Nam.
          </p>
          <p className="text-lg">
            Đồng hành cùng những nỗ lực của chúng tôi là các đơn vị tổ chức sự
            kiện - những người làm việc chăm chỉ để đảm bảo rằng người tham dự
            của họ có trải nghiệm tuyệt vời. Chúng tôi chia sẻ niềm đam mê để
            gắn kết mọi người lại với nhau, tạo ra những kỷ niệm và làm phong
            phú thêm cuộc sống.
          </p>
        </div>
      </div>

      <div className=" bg-gradient-to-r from-[#b9faa9] to-[#007BFF]">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Lợi ích dành cho người tham dự
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Biến việc mua vé sự kiện trực tuyến trở thành trải nghiệm khác
              biệt. Gắn kết người xem và tạo không gian để giao lưu theo thời
              gian thực. Eventify là phần mềm quản lý vé sự kiện được thiết kế
              tỉ mỉ, giúp hỗ trợ tối đa cho người tham dự.
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                  <img
                    alt="Icon of a ticket purchase"
                    className="h-8 w-8"
                    height="48"
                    src="https://storage.googleapis.com/a1aa/image/g0d5Db8LYyJ8AdJdfx9g5VfxfSwk2ffMkwU8GmKfa8JOS90eJA.jpg"
                    width="48"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Mua vé trực tuyến dễ dàng
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Với khả năng hỗ trợ tất cả các cổng thanh toán thông dụng,
                  người tham dự có thể thanh toán tức thì và an toàn, không cần
                  phải đến tận nơi hay đứng chờ trong một hàng dài để mua vé.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                  <img
                    alt="Icon of an instant ticket"
                    className="h-8 w-8"
                    height="48"
                    src="https://storage.googleapis.com/a1aa/image/dTY2Je7F0uVKAyYLsSKT4ZgZIa0el2kbocq9lw7Vqq5F1T7TA.jpg"
                    width="48"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Nhận vé ngay lập tức
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Vé điện tử được gửi ngay đến Email, lưu trong tài khoản của
                  bạn tại Sàn Sự Kiện. Chưa bao giờ, mua vé sự kiện lại dễ dàng
                  đến vậy.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <img
                    alt="Icon of event check-in"
                    className="h-8 w-8"
                    height="48"
                    src="https://storage.googleapis.com/a1aa/image/8Wz9bJ3YieVdaySuBOEjjrmOCoRKr92MrvNivfEcratH1T7TA.jpg"
                    width="48"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Check-in sự kiện
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Chỉ cần có smartphone, bạn có thể tham dự sự kiện mà không cần
                  cầm theo bất kỳ loại vé giấy nào khác, không lo quên hay đánh
                  mất vé nữa.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                  <img
                    alt="Icon of customer support"
                    className="h-8 w-8"
                    height="48"
                    src="https://storage.googleapis.com/a1aa/image/f9GiySnHdM1sfUIBLvJdwYUi7ZgUjoG4bTgoorIHtmAD1T7TA.jpg"
                    width="48"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Hỗ trợ dịch vụ
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Tại Sàn Sự Kiện, chúng tôi luôn đảm bảo đầy đủ quyền lợi và
                  trải nghiệm của người tham dự trên mỗi vé bán ra, cho dù bạn
                  chỉ mua 1 vé duy nhất.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <a
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700"
              href="#"
            >
              Khám phá tất cả sự kiện →
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Lợi ích dành cho nhà tổ chức sự kiện
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Công tác quản lý bán vé sự kiện giờ đây trở nên tiện dụng hơn bao
            giờ hết với các ứng dụng hỗ trợ tuyệt vời dành cho người tổ chức sự
            kiện.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <img
                  alt="Icon of a ticket purchase"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/g0d5Db8LYyJ8AdJdfx9g5VfxfSwk2ffMkwU8GmKfa8JOS90eJA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Đăng tin sự kiện
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Tạo sự kiện với thông tin như Tên sự kiện, địa điểm tổ chức,
                thời gian, mô tả, hỏi đáp tư vấn,..., nơi mọi người có thể xem
                và đặt mua vé trực tuyến.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                <img
                  alt="Icon of an instant ticket"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/dTY2Je7F0uVKAyYLsSKT4ZgZIa0el2kbocq9lw7Vqq5F1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Địa điểm sự kiện
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Hãy để những người tham dự của bạn biết họ đăng ký cho sự kiện
                gì. Tạo một thông tin địa điểm chi tiết, hiển thị cả chỉ dẫn
                đường đi trên bản đồ Google Map.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <img
                  alt="Icon of event check-in"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/8Wz9bJ3YieVdaySuBOEjjrmOCoRKr92MrvNivfEcratH1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Bán vé sự kiện
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Cấu hình nhiều hạng vé, thêm mô tả và làm nổi bật tùy chọn tốt
                nhất để giúp người tham dự dễ dàng đưa ra quyết định. Gửi vé
                ngay lập tức qua email.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                <img
                  alt="Icon of customer support"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/f9GiySnHdM1sfUIBLvJdwYUi7ZgUjoG4bTgoorIHtmAD1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Quảng bá sự kiện
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Quảng bá sự kiện thông qua các ứng dụng chuyên biệt như: email
                marketing, tích hợp lên Facebook Fanpage, tích hợp lên website,
                hoặc các mini game (chia sẻ để nhận quà)
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <img
                  alt="Icon of a ticket purchase"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/g0d5Db8LYyJ8AdJdfx9g5VfxfSwk2ffMkwU8GmKfa8JOS90eJA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Tối đa doanh thu
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Có toàn quyền kiểm soát trải nghiệm mua vé từ đầu đến cuối. Đặt
                ngày bán vé, hạng vé và giới hạn mua chỉ trong vài phút
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                <img
                  alt="Icon of an instant ticket"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/dTY2Je7F0uVKAyYLsSKT4ZgZIa0el2kbocq9lw7Vqq5F1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Kết nối cổng thanh toán
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Phân phối vé trực tuyến tiện lợi bằng tất cả các phương thức
                thanh toán (COD, ATM, Visa & Master, Momo, NgânLượng.vn, ...)
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <img
                  alt="Icon of event check-in"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/8Wz9bJ3YieVdaySuBOEjjrmOCoRKr92MrvNivfEcratH1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Soát vé thông minh
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Soát vé (Check-in) tại thời điểm diễn ra sự kiện bằng ứng dụng
                Soát vé tiện lợi. Hỗ trợ soát vé qua mã QR code hoặc mã vé điện
                tử.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                <img
                  alt="Icon of customer support"
                  className="h-8 w-8"
                  height="48"
                  src="https://storage.googleapis.com/a1aa/image/f9GiySnHdM1sfUIBLvJdwYUi7ZgUjoG4bTgoorIHtmAD1T7TA.jpg"
                  width="48"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Email Reminder
              </h3>
              <p className="mt-2 text-base text-gray-600">
                Gửi Email thông báo đến toàn bộ khách hàng đã mua vé giúp quảng
                bá hiệu quả hơn.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <a
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700"
            href="#"
          >
            Khám phá tất cả sự kiện →
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#c8f0bd] to-[#b7b7ff]">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">
            Nền tảng bán vé sự kiện hoàn hảo với hàng loạt tính năng
          </h1>
          <p className="text-gray-600 mb-8">
            Eventify cho phép bạn tạo và bán vé cho sự kiện của mình và quản lý
            tất cả dữ liệu liên quan đến sự kiện của bạn, chẳng hạn như doanh số
            bán vé, thông tin chi tiết về khách truy cập, báo cáo, v.v.v. Đây là
            nền tảng hoàn hảo để giúp bạn quản lý các sự kiện của mình một cách
            hiệu quả.
          </p>
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 text-center border-b-4 border-green-500 py-2">
              <span className="text-green-500 font-bold">Bước 01</span>
              <p className="font-bold">Trang sự kiện</p>
            </div>
            <div className="flex-1 text-center border-b-4 border-transparent py-2">
              <span className="text-gray-500">Bước 02</span>
              <p className="font-bold">Bán vé</p>
            </div>
            <div className="flex-1 text-center border-b-4 border-transparent py-2">
              <span className="text-gray-500">Bước 03</span>
              <p className="font-bold">Người tham dự</p>
            </div>
            <div className="flex-1 text-center border-b-4 border-transparent py-2">
              <span className="text-gray-500">Bước 04</span>
              <p className="font-bold">Chạy khuyến mãi</p>
            </div>
            <div className="flex-1 text-center border-b-4 border-transparent py-2">
              <span className="text-gray-500">Bước 05</span>
              <p className="font-bold">Quản lý sự kiện</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Thiết kế đáp ứng</h2>
              <p className="text-gray-600 mb-8">
                Giao diện trang sự kiện đáp ứng và thân thiện với người dùng của
                chúng tôi cho phép hiển thị phù hợp trên tất cả các loại màn
                hình thiết bị.
              </p>
              <h2 className="text-xl font-bold mb-4">
                Sự kiện công khai hoặc riêng tư
              </h2>
              <p className="text-gray-600 mb-8">
                Bạn có thể đăng tải các sự kiện của mình hiển thị công khai hoặc
                chỉ bằng lời mời, chỉ cho phép những người bạn đã mời tham gia
                sự kiện.
              </p>
              <h2 className="text-xl font-bold mb-4">
                Thời gian bắt đầu sự kiện
              </h2>
              <p className="text-gray-600 mb-8">
                Khi mà thời gian sự kiện sắp diễn ra thì sẽ được chúng tôi gửi
                mail về cho các bạn để thông báo...
              </p>
              <h2 className="text-xl font-bold mb-4">
                Sự kiện nhiều phiên hoặc nhiều ngày
              </h2>
              <p className="text-gray-600 mb-8">
                Bạn có thể đăng tải các sự kiện nhiều phiên hoặc nhiều ngày tùy
                theo nhu cầu của mình.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img
                alt="Event example with countdown timer and event details"
                className="rounded-lg shadow-lg"
                height="300"
                src="../../../public/images/logo.webp"
                width="200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold mb-8">
          Các sự kiện nổi bật đã đồng hành cùng chúng tôi
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              alt="Tiger Remix event poster with vibrant colors and fireworks"
              height="200"
              src="https://storage.googleapis.com/a1aa/image/gocX5SvGbBYvHJY9JTTA8nn58DZ71o7K7oYlObCseml5Kq9JA.jpg"
              width="600"
            />
            <h2 className="text-xl font-semibold mt-4">Tiger Remix</h2>
            <p className="mt-2 text-gray-600">
              TIGER REMIX là Đại nhạc hội lớn nhất trong năm, nơi hội tụ của
              những ca sĩ hàng đầu Việt Nam, hoà mình với hệ thống âm thanh ánh
              sáng vô cùng hiện đại và hấp dẫn.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              alt="Kulturfest event poster with a woman holding a beer and German flags"
              height="200"
              src="https://storage.googleapis.com/a1aa/image/XL2aOSlz6DobDRdDp9YzFQsjqK8AS73nF9oeJHtFyuf2VU7TA.jpg"
              width="600"
            />
            <h2 className="text-xl font-semibold mt-4">
              Lễ hội Văn hóa Việt Đức - KULTURFEST
            </h2>
            <p className="mt-2 text-gray-600">
              KULTURFEST tổ chức nhằm giới thiệu tới khách tham quan về nền văn
              hóa Đức, các sản phẩm tiêu biểu, văn hóa ẩm thực, cuộc sống cộng
              đồng người Việt tại CHLB Đức thông qua các hoạt động giao lưu văn
              hóa.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              alt="Conference poster with logos and blue gradient background"
              height="200"
              src="https://storage.googleapis.com/a1aa/image/64lK9v8PBYIPCN1e6yGsUfyjD5As5NKHJGqef9J0vCZQXRtPB.jpg"
              width="600"
            />
            <h2 className="text-xl font-semibold mt-4">
              Hội nghị Khoa học &amp; Đào tạo Răng Hàm Mặt lần thứ 11
            </h2>
            <p className="mt-2 text-gray-600">
              Hội nghị Khoa học và Đào tạo Răng Hàm Mặt 2021 lần thứ 11 với chủ
              đề “Nha khoa 2021: Thách thức và cơ hội mới” là một trong những sự
              kiện quan trọng trong chuyên ngành Răng Hàm Mặt Việt Nam.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 py-10 mt-10">
        <h2 className="text-center text-white text-xl font-semibold mb-6">
          Các đối tác sự kiện tin tưởng đồng hành cùng chúng tôi
        </h2>
        <div className="flex justify-center space-x-8">
          <img
            alt="Logo of VEAS"
            height="100"
            src="https://storage.googleapis.com/a1aa/image/eww9Rc3d46yxLaWUtQkTgWrXALebrCD3q0SMYOMlpwtgTU7TA.jpg"
            width="100"
          />
          <img
            alt="Logo of ADPEX"
            height="100"
            src="https://storage.googleapis.com/a1aa/image/Tns6Vdnj374gH1fweqPsWdbBfqpAZYl5gVEJ70GwqWnKno2nA.jpg"
            width="100"
          />
          <img
            alt="Logo of OMG"
            height="100"
            src="https://storage.googleapis.com/a1aa/image/YKTne7TwV4R4J6q13S1xeI4Ced1IvEwehDywRsUpppKLORtPB.jpg"
            width="100"
          />
          <img
            alt="Logo of VIETFAIR"
            height="100"
            src="https://storage.googleapis.com/a1aa/image/Bp3qrgWdPSZfWiF4PWes1lUZjQAaPmWGiCeuUfF44AMTORtPB.jpg"
            width="100"
          />
          <img
            alt="Logo of CHANH"
            height="100"
            src="https://storage.googleapis.com/a1aa/image/CHCQdZtLGpZvKteiOSAWjxw8tQOKzCja7oc6M5wRURtwJq9JA.jpg"
            width="100"
          />
        </div>
      </div>
      <div className="text-center py-10">
        <p className="text-lg mb-6">
          ...và chính bạn cũng có thể bắt đầu ngay bây giờ
        </p>
        <div className="flex justify-center space-x-4">
          <button className="border border-gray-200 text-gray-700 py-2 px-4 rounded">
            Liên hệ bộ phận bán hàng
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Xem các gói dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
