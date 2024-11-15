import React from 'react'

const Order = () => {
  return (
    <div className='mt-36'>
              {/* <!--router page --> */}
      <div className="w-full lg:py-7 mb:py-[18px] bg-[#F4F4F4] grid place-items-center -mt-[1px]">
        <div className="flex -translate-x-[1px] items-center gap-x-4 text-sm">
          <div className="flex items-center gap-x-2">
            <div className="w-[30px] h-[30px] p-2 text-white bg-[#C3D2CC] rounded-[50%] flex place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke=" #05422C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-check"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span className="hidden lg:block">Check out</span>
          </div>
          <div className="lg:w-[74.5px] mb:min-w-[39.5px] h-[1px] bg-[#C3D2CC]"></div>
          <div className="flex items-center gap-x-2">
            <img
              className="w-[30px] h-[30px] p-2 text-white bg-white rounded-full"
              src="../../../public/images/order.png"
              alt="order"
            />
            <span>Order complete</span>
          </div>
        </div>
      </div>

        <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Your Order</h1>
            <div className="text-green-500 flex items-center">
                <i className="fas fa-check-circle mr-2"></i> Paid
            </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center mb-4">
                <img alt="Image of Khalifa Kush (AAAA)" className="w-12 h-12 mr-4" height="50" src="https://storage.googleapis.com/a1aa/image/NaeFMwze7nhO204lrAdGtobCLqUyr2zmzfrrmeXduOJBfyAeE.jpg" width="50"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <span>1x Khalifa Kush (AAAA)</span>
                        <span className="text-gray-500">2x $120.00</span>
                        <span className="font-semibold">$240.00</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <img alt="Image of Jungle Diamond (AA+)" className="w-12 h-12 mr-4" height="50" src="https://storage.googleapis.com/a1aa/image/HP9ejLJsmTVlQ6YJ0St5Ewcz0MeXWPZLwXFEMCpmC8zvXGwTA.jpg" width="50"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <span>1x Jungle Diamond (AA+)</span>
                        <span className="text-gray-500">1x $200.00</span>
                        <span className="font-semibold">$200.00</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <img alt="Image of Shipwreck Edibles Gummy" className="w-12 h-12 mr-4" height="50" src="https://storage.googleapis.com/a1aa/image/XQJYfOKKhOxSNCZabLojI5GmLOkhC2NyEmaTfcBEe5ikvMgnA.jpg" width="50"/>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <span>Shipwreck Edibles Gummy</span>
                        <span className="text-gray-500">4x $13.00</span>
                        <span className="font-semibold">$52.00</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">TOTAL</span>
                <span className="text-red-500 font-semibold text-lg">$497.00</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="grid lg:grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Shipping</span>
                        <span>New York, US</span>
                    </div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Shipping Options</span>
                        <span>Same-Day Dispatching</span>
                    </div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Email Money Transfer</span>
                        <span>Interac</span>
                    </div>
                </div>
                <div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Subtotal</span>
                        <span>$497.00</span>
                    </div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Discount</span>
                        <span>$0.0</span>
                    </div>
                    <div className="flex md:flex-row justify-between mb-2">
                        <span className='text-gray-500'>Shipping Costs</span>
                        <span>$50.00</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">TOTAL</span>
                <span className="text-red-500 font-semibold text-lg">$297.00</span>
            </div>
        </div>
        <div className="text-center mt-8">
            <button className="bg-[#007BFF] text-white px-6 py-2 rounded-full">Home</button>
        </div>
    </div>
    </div>
  )
}

export default Order
