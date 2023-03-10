import React from 'react'

export default function Final_price({
  regPeriod,
  priceToPay,
}: {
  regPeriod: number
  priceToPay: number
}) {
  return (
    <div className='flex flex-col items-center mt-9 h-96 w-full bg-[#334155] rounded-t-lg lg:flex-row lg:rounded-l-lg lg:h-32'>
      <div className='bg-[#334155] flex flex-col items-center w-full lg:w-2/3 lg:flex-row'>
        {/* Estimated Total Price */}
        <div className='px-12 py-8 bg-[#334155] lg:py-0'>
          <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
            Estimated Total Price
          </p>
          <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
            {(priceToPay * regPeriod).toFixed(3)} ETH
          </p>
        </div>
        {/* + */}
        <div className='text-white text-xl'>+</div>
        {/* Gas Fee (at most) */}
        <div className='px-12 py-8 bg-[#334155] lg:py-0'>
          <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
            Gas Fee (at most)
          </p>
          <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
            0.011 ETH
          </p>
        </div>
      </div>

      {/* Final Price -- TODO change 0.011 with gas fee */}
      <div className='flex flex-col text-center items-center w-full bg-[#F97316] h-32 py-6 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg lg:w-1/3'>
        <div className='px-20 flex flex-col justify-center items-center text-center lg:px-10'>
          <p className='text-[#FED7AA] text-xs'>At most</p>
          <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
            {(priceToPay * regPeriod + 0.011).toFixed(3)} ETH
          </p>
          <p className='text-[#FED7AA] text-xs'>
            Calculated to{' '}
            <span className='font-semibold text-white'>$21.65 USD</span>
          </p>
        </div>
      </div>
    </div>
  )
}
