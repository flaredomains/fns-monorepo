import React from 'react'
import Like from '../../public/Like.svg'
import Dislike from '../../public/Dislike.svg'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Remind from '../../public/Remind.svg'
import Image from 'next/image'

export default function Info({
  available,
  parent,
  registrant_address,
  controller,
  date,
}: {
  available: boolean
  parent: String
  registrant_address: String
  controller: String
  date: Date
}) {
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = date.getFullYear()

  return (
    <>
      <div className='flex-col bg-gray-800 px-8 py-12'>
        {/* Alert */}
        <div className='flex w-full bg-gray-500 py-3 px-5 rounded-lg'>
          <Image
            className='h-4 w-4 mr-2'
            src={available ? Like : Dislike}
            alt='FNS'
          />
          <div className='flex-col'>
            <p className='text-gray-200 font-semibold text-sm'>
              This name {available ? 'is' : 'is not'} available!
            </p>
          </div>
        </div>
        {/* Details */}
        <div className='flex-col w-full mt-10'>
          {/* Parent */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Parent
            </p>
            <div className='flex items-center mt-2 lg:mt-0'>
              <p className='font-semibold text-[#F97316] text-base'>{parent}</p>
            </div>
          </div>
          {/* Registrant */}
          <div className='flex-col items-center w-full mb-6 lg:flex lg:flex-row'>
            <p className='font-semibold text-white text-base w-32 mr-12'>
              Registrant
            </p>
            <div className='flex items-center mt-2 lg:mt-0'>
              <p className='font-semibold text-[#F97316] text-base'>
                {registrant_address ? registrant_address : '0x0'}
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
                {controller ? controller : 'Not Owned'}
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
                {`${month} ${day}, ${year} (UTC - ${date.toLocaleTimeString()})`}
              </p>
              <button className='flex items-center px-3 py-2 border-2 border-[#F97316] mt-2 lg:mt-0'>
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
