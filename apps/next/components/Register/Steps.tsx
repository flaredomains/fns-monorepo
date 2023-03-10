import React from 'react'

export default function Steps() {
  return (
    <>
      <div className='flex flex-col mt-10 w-full lg:flex-row'>
        {/* 1 */}
        <div className='w-full flex-col justify-center items-center lg:w-1/3'>
          {/* Line and number */}
          <div className='flex justify-center items-center w-full'>
            {/* First half line */}
            <div className='w-1/2 h-1 bg-[#F97316]' />
            {/* Number */}
            <div className='flex justify-center items-center bg-[#F97316] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
              <p className='text-white'>1</p>
            </div>
            {/* Second half line */}
            <div className='w-1/2 h-1 bg-[#F97316]' />
          </div>
          <p className='text-white font-medium mt-2 text-center'>
            Request to Register
          </p>
          <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>
            Your wallet will open and you will be asked to confirm the first of
            two transactions required for registration. If the second
            transaction is not processed within 7 days of the first, you will
            need to start again from step 1.
          </p>
        </div>
        {/* 2 */}
        <div className='w-full flex-col justify-center items-center mt-4 lg:mt-0 lg:w-1/3'>
          {/* Line and number */}
          <div className='flex justify-center items-center w-full'>
            {/* First half line */}
            <div className='w-1/2 h-1 bg-[#F97316]' />
            {/* Number */}
            <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
              <p className='text-white'>2</p>
            </div>
            {/* Second half line */}
            <div className='w-1/2 h-1 bg-[#334155]' />
          </div>
          <p className='text-white font-medium mt-2 text-center'>
            Wait for 1 minute
          </p>
          <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>
            The waiting period is required to ensure another person hasn&apos;t
            tried to register the same name and protect you after your request.
          </p>
        </div>
        {/* 3 */}
        <div className='w-full flex-col justify-center items-center mt-4 lg:mt-0 lg:w-1/3'>
          {/* Line and number */}
          <div className='flex justify-center items-center w-full'>
            {/* First half line */}
            <div className='w-1/2 h-1 bg-[#334155]' />
            {/* Number */}
            <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#E2E8F0] h-9 w-9 rounded-full p-3 text-center'>
              <p className='text-white'>3</p>
            </div>
            {/* Second half line */}
            <div className='w-1/2 h-1 bg-[#334155]' />
          </div>
          <p className='text-white font-medium mt-2 text-center'>
            Complete Registration
          </p>
          <p className='text-[#94A3B8] text-[0.625rem] mx-2 font-normal mt-4 text-center'>
            Click &apos;register&apos; and your wallet will re-open. Only after
            the 2nd transaction is confirmed you&apos;ll know if you got the
            name.
          </p>
        </div>
      </div>
    </>
  )
}
