import React, { useState, useEffect } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Plus from '../../public/Plus.svg'
import Delete from '../../public/Delete.svg'
import Image from 'next/image'

const listAddresses: Array<{ leftText: String; rightText: String }> = [
  { leftText: 'XTP', rightText: '0x880426bb362Bf481d6891839f1B0dAEB57900591' },
  { leftText: 'BTC', rightText: 'aaaa' },
  { leftText: 'LTC', rightText: '' },
  { leftText: 'DOGE', rightText: '' },
]

const listTextRecords: Array<{ leftText: String; rightText: String }> = [
  {
    leftText: 'Email',
    rightText: '0x880426bb362Bf481d6891839f1B0dAEB57900591',
  },
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

const Info = ({
  leftText,
  rightText,
  index,
  recordsEditMode,
  isAddressList,
  deleteButton,
}: {
  leftText: String
  rightText: String
  index: number
  recordsEditMode: boolean
  isAddressList: boolean
  deleteButton: (isAddressList: boolean, index: number) => void
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(rightText.toString())
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }
  return (
    <>
      <div className="flex flex-col mb-3 lg:flex-row lg:items-center">
        <p className="w-32 text-white font-medium text-xs mr-6">{leftText}</p>
        {!recordsEditMode && (
          <>
            <p
              className={`${
                rightText ? 'text-[#F97316]' : 'text-gray-400'
              } font-medium text-xs mr-3`}
            >
              {rightText
                ? `${
                    /^0x/.test(rightText.toString())
                      ? `${rightText.slice(0, 6)}...${rightText.slice(-4)}`
                      : rightText
                  }`
                : 'Not Set'}
            </p>
            {copied ? (
              <>
                <p className="text-[#F97316] font-medium text-sm">Copied</p>
              </>
            ) : (
              rightText && (
                <Image
                  onClick={handleCopy}
                  className="h-4 w-4 cursor-pointer"
                  src={Clipboard_copy}
                  alt="FNS"
                />
              )
            )}
          </>
        )}
        {recordsEditMode && (
          <div className="flex items-center mt-2 lg:mt-0">
            <div className="h-5 w-72 bg-gray-700 border border-gray-500 rounded-md mr-4 lg:w-48 xl:w-72" />
            <Image
              onClick={() => deleteButton(isAddressList, index)}
              className="h-5 w-5 cursor-pointer"
              src={Delete}
              alt="FNS"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default function Records({ address }: { address: String }) {
  const [recordsEditMode, setRecordsEditMode] = useState<boolean>(false)
  const [arrAddresses, setArrAddresses] =
    useState<Array<{ leftText: String; rightText: String }>>(listAddresses)
  const [arrTextRecords, setArrTextRecords] =
    useState<Array<{ leftText: String; rightText: String }>>(listTextRecords)
  const [copyArrAddr, setCopyArrAddr] =
    useState<Array<{ leftText: String; rightText: String }>>(listAddresses)
  const [copyArrTextRecords, setCopyArrTextRecords] =
    useState<Array<{ leftText: String; rightText: String }>>(listTextRecords)

  const [isLarge, setisLarge] = useState(false)

  // UseEffect for resize the address when viewport become to small
  useEffect(() => {
    const handleResize = () => {
      setisLarge(window.innerWidth >= 1280)
    }

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener('resize', handleResize)

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Save the REAL array in a copy
  function editMode() {
    setCopyArrAddr(arrAddresses)
    setCopyArrTextRecords(arrTextRecords)
    setRecordsEditMode(true)
  }

  // Change the REAL array with the copy one
  function save() {
    setArrAddresses(copyArrAddr)
    setArrTextRecords(copyArrTextRecords)
    setRecordsEditMode(false)
  }

  // Return to normal mode without save
  function cancel() {
    setCopyArrAddr(arrAddresses)
    setCopyArrTextRecords(arrTextRecords)
    setRecordsEditMode(false)
  }

  // Delete the element from list
  function deleteButton(isAddressList: boolean, index: number) {
    if (isAddressList) {
      setCopyArrAddr(copyArrAddr.filter((_, i) => i !== index))
    } else {
      setCopyArrTextRecords(copyArrTextRecords.filter((_, i) => i !== index))
    }
  }

  return (
    <>
      {/* Records / Addresses */}
      <>
        <div className="flex-col bg-gray-800 px-8 pb-14">
          <div className="flex-col justify-between mb-10 md:flex md:flex-row">
            {/* Records */}
            <h1 className="text-white text-2xl font-semibold">Records</h1>
            {/* Add/Edit Record buttons Desktop */}
            {!recordsEditMode && (
              <button
                onClick={() => editMode()}
                className="justify-center items-center hidden text-center bg-[#F97316] h-8 w-1/2 rounded-lg text-white px-auto mt-5 hover:scale-105 transform transition duration-300 ease-out md:w-1/4 lg:flex lg:mt-0 lg:ml-auto"
              >
                <p className="text-xs font-medium mr-2">Add/Edit Record</p>
                <Image className="h-4 w-4" src={Plus} alt="FNS" />
              </button>
            )}
            {recordsEditMode && (
              <>
                <div className="items-center mt-5 hidden lg:flex lg:mt-0 lg:ml-auto">
                  {/* Cancel */}
                  <button
                    onClick={() => cancel()}
                    className="flex items-center justify-center px-3 py-2 border border-gray-400 rounded-lg mr-2 hover:scale-105 transform transition duration-300 ease-out"
                  >
                    <p className="text-gray-400 text-medium text-xs">Cancel</p>
                  </button>

                  {/* Save */}
                  <button
                    onClick={() => save()}
                    className="flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] hover:scale-105 transform transition duration-300 ease-out lg:ml-auto"
                  >
                    <p className="text-xs font-medium">Save</p>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col lg:flex-row">
            {/* Addresses */}
            <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0">
              Addresses
            </h2>
            <div className="flex-col items-center">
              {copyArrAddr.map((item, index) => (
                <Info
                  key={index}
                  leftText={item.leftText}
                  rightText={item.rightText}
                  index={index}
                  recordsEditMode={recordsEditMode}
                  isAddressList={true}
                  deleteButton={deleteButton}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-col bg-gray-800 px-8 pb-14">
          <div className="flex flex-col lg:flex-row">
            {/* Text Records */}
            <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0">
              Text Records
            </h2>
            <div className="flex-col items-center">
              {copyArrTextRecords.map((item, index) => (
                <Info
                  key={index}
                  leftText={item.leftText}
                  rightText={item.rightText}
                  index={index}
                  recordsEditMode={recordsEditMode}
                  isAddressList={false}
                  deleteButton={deleteButton}
                />
              ))}
            </div>
          </div>
          {/* Add/Edit Record buttons Mobile */}
          {!recordsEditMode && (
            <button
              onClick={() => editMode()}
              className="flex justify-center items-center text-center bg-[#F97316] h-8 w-1/2 rounded-lg text-white px-auto mt-5 md:w-1/4 lg:hidden lg:mt-0 lg:ml-auto"
            >
              <p className="text-xs font-medium mr-2">Add/Edit Record</p>
              <Image className="h-4 w-4" src={Plus} alt="FNS" />
            </button>
          )}
          {recordsEditMode && (
            <>
              <div className="flex items-center mt-5 lg:mt-0 lg:ml-auto lg:hidden">
                {/* Cancel */}
                <button
                  onClick={() => cancel()}
                  className="flex items-center justify-center px-3 py-2 border border-gray-400 rounded-lg mr-2"
                >
                  <p className="text-gray-400 text-medium text-xs">Cancel</p>
                </button>

                {/* Save */}
                <button
                  onClick={() => save()}
                  className="flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] lg:ml-auto"
                >
                  <p className="text-xs font-medium">Save</p>
                </button>
              </div>
            </>
          )}
        </div>
      </>
    </>
  )
}
