import React from 'react'
import Info from '../../public/Info.svg'
import Plus from '../../public/Plus.svg'
import Image from 'next/image'

export default function Bottom() {
  return (
    <>
      {/* Connect Wallet -- Hidden Mobile */}
      <div className='hidden mt-10 items-center w-full lg:flex'>
        {/* Info icon + Message */}
        <div className='w-2/3 flex items-center bg-[#334155] h-12 rounded-lg text-[#9cacc0] px-5 mr-4'>
          <Image className='h-4 w-4 mr-2' src={Info} alt='FNS' />
          <p className='text-xs font-medium'>
            No wallet connected. Please connect to continue.
          </p>
        </div>
        {/* Connect + */}
        <div className='w-1/3 flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
          <p className='text-base font-semibold mr-2'>Connect</p>
          <Image className='h-4 w-4' src={Plus} alt='FNS' />
        </div>
      </div>

      {/* Request to Register -- Hidden Desktop */}
      <div className='mt-10 flex items-center w-full lg:hidden'>
        <div className='w-full flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
          <p className='text-base font-semibold mr-2'>Request to Register</p>
          <Image className='h-4 w-4' src={Plus} alt='FNS' />
        </div>
      </div>
    </>
  )
}
