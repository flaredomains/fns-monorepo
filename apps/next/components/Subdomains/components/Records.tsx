import React, { useState, useEffect } from 'react'
import Clipboard_copy from '../../../public/Clipboard_copy.svg'
import Plus from '../../../public/Plus.svg'
import Delete from '../../../public/Delete.svg'
import Image from 'next/image'

const listAddresses = [
  { leftText: 'BTC', rightText: '' },
  { leftText: 'LTC', rightText: '' },
  { leftText: 'DOGE', rightText: '' },
]

const listTextRecords = [
  { leftText: 'URL', rightText: '' },
  { leftText: 'Avatar', rightText: '' },
  { leftText: 'Description', rightText: '' },
  { leftText: 'Notice', rightText: '' },
  { leftText: 'Keywords', rightText: '' },
  { leftText: 'com.discord', rightText: '' },
  { leftText: 'com.github', rightText: '' },
  { leftText: 'com.reddit', rightText: '' },
  { leftText: 'com.twitter', rightText: '' },
  { leftText: 'com.twitter', rightText: '' },
  { leftText: 'org.telegram', rightText: '' },
  { leftText: 'eth.ens.delegate', rightText: '' },
]

export default function Records({ address }: { address: String }) {
  const [recordsEditMode, setRecordsEditMode] = useState(false)

  const [isLarge, setisLarge] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setisLarge(window.innerWidth >= 1280)
    }

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener('resize', handleResize)

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Records / Addresses */}
      <>
        <div className='flex-col bg-gray-800 px-8 pb-14'>
          <div className='flex-col justify-between mb-10 md:flex md:flex-row'>
            {/* Records */}
            <h1 className='text-white text-2xl font-semibold'>Records</h1>
            {/* Add/Edit Record */}
            {!recordsEditMode && (
              <button
                onClick={() => setRecordsEditMode(true)}
                className='flex justify-center items-center text-center bg-[#F97316] h-8 w-1/2 rounded-lg text-white px-auto mt-5 md:w-1/4 lg:mt-0 lg:ml-auto'
              >
                <p className='text-xs font-medium mr-2'>Add/Edit Record</p>
                <Image className='h-4 w-4' src={Plus} alt='FNS' />
              </button>
            )}
            {recordsEditMode && (
              <>
                <div className='flex items-center mt-5 lg:mt-0 lg:ml-auto'>
                  <button
                    onClick={() => setRecordsEditMode(false)}
                    className='flex items-center justify-center px-3 py-2 border border-gray-400 rounded-lg mr-2'
                  >
                    <p className='text-gray-400 text-medium text-xs'>Cancel</p>
                  </button>
                  <button
                    onClick={() => setRecordsEditMode(false)}
                    className='flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] lg:ml-auto'
                  >
                    <p className='text-xs font-medium'>Save</p>
                  </button>
                </div>
              </>
            )}
          </div>
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
                    {isLarge
                      ? address
                      : `${address.slice(0, 6)}...${address.slice(-4)}`}
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
              {listAddresses.map((item, index) => (
                <>
                  <div className='flex flex-col mb-3 lg:flex-row lg:items-center'>
                    <p className='w-32 text-white font-medium text-xs mr-6'>
                      {item.leftText}
                    </p>
                    {!recordsEditMode && (
                      <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                        {item.rightText ? item.rightText : 'Not Set'}
                      </p>
                    )}
                    {recordsEditMode && (
                      <div className='flex items-center mt-2 lg:mt-0'>
                        <div className='h-5 w-72 bg-gray-700 border border-gray-500 rounded-md mr-4 lg:w-48 xl:w-72' />
                        <Image
                          onClick={() => listAddresses.splice(index, 1)}
                          className='h-5 w-5 cursor-pointer'
                          src={Delete}
                          alt='FNS'
                        />
                      </div>
                    )}
                  </div>
                </>
              ))}
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
                <p className='w-32 text-white font-medium text-xs mr-6'>
                  Email
                </p>
                <div className='flex items-center mt-2 lg:mt-0'>
                  <p className='text-[#F97316] font-medium text-xs mr-3'>
                    {isLarge
                      ? address
                      : `${address.slice(0, 6)}...${address.slice(-4)}`}
                  </p>
                  <Image
                    className='h-4 w-4 cursor-pointer'
                    src={Clipboard_copy}
                    alt='FNS'
                  />
                </div>
              </div>
              {listTextRecords.map((item, index) => (
                <>
                  <div className='flex flex-col mb-3 lg:flex-row lg:items-center'>
                    <p className='w-32 text-white font-medium text-xs mr-6'>
                      {item.leftText}
                    </p>

                    {!recordsEditMode && (
                      <p className='text-gray-400 font-medium text-xs mt-2 lg:mt-0'>
                        {item.rightText ? item.rightText : 'Not Set'}
                      </p>
                    )}

                    {recordsEditMode && (
                      <div className='flex items-center mt-2 lg:mt-0'>
                        <div className='h-5 w-72 bg-gray-700 border border-gray-500 rounded-md mr-4 lg:w-48 xl:w-72' />
                        <Image
                          onClick={() => listTextRecords.splice(index, 1)}
                          className='h-5 w-5 cursor-pointer'
                          src={Delete}
                          alt='FNS'
                        />
                      </div>
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </>
    </>
  )
}
