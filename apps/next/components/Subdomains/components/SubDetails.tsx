import React, { useState, useEffect } from 'react'
import Clipboard_copy from '../../../public/Clipboard_copy.svg'
import Remind from '../../../public/Remind.svg'
import Image from 'next/image'

export default function SubDetails({
  address,
  date,
}: {
  address: String
  date: Date
}) {
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = date.getFullYear()

  const [isLarge, setIsLarge] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 1280)
    }

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener('resize', handleResize)

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div className='flex-col bg-gray-800 px-8 py-2 md:py-10'>
        {/* Details */}
        <div className='flex-col w-full pr-3'>
          {/* Parent */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Parent
            </p>
            <div className='flex items-center mt-2 lg:mt-0'>
              {/* Change parent with data value */}
              <p className='font-semibold text-[#F97316] text-base'>
                Ripple Network
              </p>
            </div>
          </div>
          {/* Registrant */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Registrant
            </p>
            <div className='flex items-center mt-2 lg:mt-0'>
              <p className='font-semibold text-[#F97316] text-base'>
                {/* Change Registrant with data value */}
                {isLarge
                  ? address
                  : `${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
              <Image
                className='h-4 w-4 cursor-pointer ml-4'
                src={Clipboard_copy}
                alt='FNS'
              />
            </div>
          </div>
          {/* Controller */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Controller
            </p>
            <div className='flex items-center mt-2 lg:mt-0'>
              <p className='font-semibold text-[#F97316] text-base'>
                {/* Change Controller with data value */}
                {isLarge
                  ? address
                  : `${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
              <Image
                className='h-4 w-4 cursor-pointer ml-4'
                src={Clipboard_copy}
                alt='FNS'
              />
            </div>
          </div>
          {/* Expiration Date */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Expiration Date
            </p>
            <div className='flex-col items-center mt-2 lg:mt-0 lg:flex lg:flex-row'>
              <p className='font-semibold text-white text-base mr-12'>
                {`${month} ${day}, ${year} (UTC - 7:00)`}
              </p>
              <button className='flex items-center px-3 py-2 border-2 border-[#F97316] rounded-lg mt-2 lg:mt-0'>
                <div className='flex items-center'>
                  <Image className='h-4 w-4 mr-2' src={Remind} alt='FNS' />
                  <p className='text-xs font-medium text-white'>Remind Me</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
