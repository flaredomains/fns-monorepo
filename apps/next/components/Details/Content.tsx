import React, { useState } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'

export default function Content() {
  const address = '0x880426bb362Bf481d6891839f1B0dAEB57900591'

  // const [copied, setCopied] = useState(false)

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(address)
  //   setCopied(true)

  //   setTimeout(() => {
  //     setCopied(false)
  //   }, 2000)
  // }

  return (
    <>
      <div className='flex-col bg-gray-800 px-8 pb-14'>
        <h1 className='text-white text-2xl font-semibold mb-10'>Records</h1>
        <div className='flex flex-col lg:flex-row'>
          {/* Addresses */}
          <h2 className='text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0'>
            Addresses
          </h2>
          <div className='flex-col items-center'>
            {/* XRP */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>XRP</p>
              <div className='flex items-center mt-2 lg:mt-0'>
                <p className='text-[#F97316] font-medium text-xs mr-3'>
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
                <Image
                  className='h-4 w-4 cursor-pointer'
                  // onClick={handleCopy}
                  src={Clipboard_copy}
                  alt='FNS'
                />
                {/* {copied && (
                  <div className='bg-gray-400 text-white text-xs py-1 px-2 rounded bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1'>
                    Copied
                  </div>
                )} */}
              </div>
            </div>
            {/* BTC */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>BTC</p>
              <p className='text-gray-400 font-medium text-xs'>Not Set</p>
            </div>
            {/* LTC */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>LTC</p>
              <p className='text-gray-400 font-medium text-xs'>Not Set</p>
            </div>
            {/* Doge */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>Doge</p>
              <p className='text-gray-400 font-medium text-xs'>Not Set</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-col bg-gray-800 px-8 pb-14'>
        <div className='flex flex-col lg:flex-row'>
          {/* Text Records */}
          <h2 className='text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0'>
            Text Records
          </h2>
          <div className='flex-col items-center'>
            <div className='flex flex-col mb-3 lg:flex-row'>
              {/* Email */}
              <p className='w-32 text-white font-medium text-xs mr-6'>Email</p>
              <div className='flex items-center mt-2 lg:mt-0'>
                <p className='text-[#F97316] font-medium text-xs mr-3'>
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
                <Image
                  className='h-4 w-4 cursor-pointer'
                  src={Clipboard_copy}
                  alt='FNS'
                />
              </div>
            </div>
            {/* Url */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>Url</p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* Avatar */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>Avatar</p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* Description */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                Description
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* Notice */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>Notice</p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* Keywords */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                Keywords
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* com.discord */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                com.discord
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* com.github */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                com.github
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* com.reddit */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                com.reddit
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* com.twitter */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                com.twitter
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* org.twitter */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                org.twitter
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
            {/* eth.ens.delegate */}
            <div className='flex flex-col mb-3 lg:flex-row'>
              <p className='w-32 text-white font-medium text-xs mr-6'>
                eth.ens.delegate
              </p>
              <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                Not Set
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
