import React, { useState } from 'react'

function Domain_Select() {
  return (
    <>
      {/* Domain Container */}
      <div className='flex justify-between items-center w-full rounded-t-lg h-28 bg-[#334155] px-9 mr-4'>
        {/* Domain */}
        <p className='text-white font-bold text-4xl'>neel.eth</p>
        {/* Search Icon */}
        <div className='h-7 w-7 mr-1'>
          <svg
            viewBox='0 0 19 19'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M17.5572 17.3121L12.3181 12.0729M14.0644 7.70702C14.0644 11.0828 11.3279 13.8193 7.95214 13.8193C4.57641 13.8193 1.83984 11.0828 1.83984 7.70702C1.83984 4.33129 4.57641 1.59473 7.95214 1.59473C11.3279 1.59473 14.0644 4.33129 14.0644 7.70702Z'
              stroke='#94A3B8'
              strokeWidth='1.87485'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>
    </>
  )
}

export default Domain_Select
