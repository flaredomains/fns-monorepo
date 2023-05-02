import React, { useState } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'
import Plus from '../../public/Plus.svg'
import Delete from '../../public/Delete.svg'

import FNSRegistry from '../../src/pages/abi/FNSRegistry.json'
import PublicResolver from '../../src/pages/abi/PublicResolver.json'
import AddrResolver from '../../src/pages/abi/PublicResolver.sol/AddrResolver.json'
import TextResolver from '../../src/pages/abi/PublicResolver.sol/TextResolver.json'

import {
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'

const namehash = require('eth-ens-namehash')

const listAddresses: Array<{ leftText: string; rightText: string }> = [
  { leftText: 'ETH', rightText: '' },
  { leftText: 'BTC', rightText: '' },
  { leftText: 'LTC', rightText: '' },
  { leftText: 'DOGE', rightText: '' },
]

const listTextRecords: Array<{ leftText: String; rightText: String }> = [
  {
    leftText: 'Email',
    rightText: '',
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
]

const keysTexts: Array<string> = [
  'URL',
  'Avatar',
  'Description',
  'Notice',
  'Keywords',
  'com.discord',
  'com.github',
  'com.reddit',
  'com.twitter',
  'com.twitter',
  'org.telegram',
]

const keysAddr: Array<string> = ['XTP', 'BTC', 'LTC', 'DOGE']

// leftText ---> key -- ex. ETH,BTC,... or email,URL
// rightText ---> value -- ex. addrETH, addrBTC,... or simone@elevatesoftware.io,....
// isAddressList --- if is Address field or Text Record field
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
  const [input, setInput] = useState('')

  const handleCopy = () => {
    navigator.clipboard.writeText(rightText.toString())
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  // WAGMI TEXT RECORD WRITE FUNCTION will active if isAddressList === false
  // setText(namehash(domainName), keyString, valueString)
  const { config: prepareSetText } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: TextResolver.abi,
    functionName: 'setText',
    // args: [input],   TODO: put the right args
    enabled: !isAddressList && input !== '',
    onSuccess(data: any) {
      console.log('Success prepareSetText', data)
    },
    onError(error) {
      console.log('Error prepareSetText', error)
    },
  })

  // SetName Write Func
  const { write: writeSetText } = useContractWrite({
    ...prepareSetText,
    onSuccess(data) {
      console.log('Success writeSetText', data)
      // setWriteFuncHash(data.hash)
    },
  }) as any

  // WAGMI ADDRESSES WRITE FUNCTION will active if isAddressList === true
  // setAddr(bytes32 node, uint256 coinType, bytes a)
  const { config: prepareSetAddr } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: prepareSetText.abi,
    functionName: 'setAddr',
    // args: [input],   TODO: put the right args
    enabled: isAddressList && input !== '',
    onSuccess(data: any) {
      console.log('Success setAddr', data)
    },
    onError(error) {
      console.log('Error setAddr', error)
    },
  })

  // SetName Write Func
  const { write: writeSetAddr } = useContractWrite({
    ...prepareSetAddr,
    onSuccess(data) {
      console.log('Success writeSetAddr', data)
    },
  }) as any

  return (
    <>
      <div className="flex flex-col mb-3 lg:flex-row lg:items-center">
        <p className="w-32 text-white font-medium text-xs mr-6">{leftText}</p>
        {/* Not Edit section */}
        {!recordsEditMode && (
          <>
            <p
              className={`${
                rightText ? 'text-[#F97316]' : 'text-gray-400'
              } font-medium text-xs mr-3 mt-2 lg:mt-0`}
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
        {/* Edit section */}
        {recordsEditMode && (
          <div className="flex items-center mt-2 lg:mt-0">
            <div className="h-7 w-72 px-2 bg-gray-300 border-2 border-gray-700 rounded-md mr-4 lg:w-48 xl:w-72">
              <input
                type="text"
                name="input-field"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                }}
                className="w-full bg-transparent font-normal text-base text-gray-800 border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal focus:bg-transparent"
              />
            </div>
            <Image
              onClick={() => setInput('')}
              className="h-5 w-5 cursor-pointer mr-4"
              src={Delete}
              alt="FNS"
            />
            {/* Save -- setText or setAddr (based on isAddressList variable) */}
            {input !== '' && (
              <button
                onClick={
                  isAddressList
                    ? () => writeSetAddr?.() // setAddr write function
                    : () => writeSetText?.() // setText write function
                }
                className="flex justify-center items-center text-center bg-[#F97316] px-2 py-1 rounded-lg text-white border border-[#F97316] lg:ml-auto"
              >
                <p className="text-xs font-medium">Save</p>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function Content({
  result,
  prepared,
  checkOwnerDomain,
}: {
  result: String
  prepared: boolean
  checkOwnerDomain: boolean
}) {
  const [recordPrepared, setRecordPrepared] = useState(false)

  const [recordsEditMode, setRecordsEditMode] = useState<boolean>(false)
  const [arrAddresses, setArrAddresses] =
    useState<Array<{ leftText: String; rightText: String }>>(listAddresses)
  const [arrTextRecords, setArrTextRecords] =
    useState<Array<{ leftText: String; rightText: String }>>(listTextRecords)
  const [copyArrAddr, setCopyArrAddr] =
    useState<Array<{ leftText: String; rightText: String }>>(listAddresses)
  const [copyArrTextRecords, setCopyArrTextRecords] =
    useState<Array<{ leftText: String; rightText: String }>>(listTextRecords)

  // console.log('namehash.hash(result)', namehash.hash(result))

  // TO CHANGE WITH WAGMI READ/WRITE FUNCTION
  // Save the REAL array in a copy
  function editModeFunc() {
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

  const { data: resolver } = useContractRead({
    address: FNSRegistry.address as `0x${string}`,
    abi: FNSRegistry.abi,
    functionName: 'resolver',
    enabled: prepared,
    args: [namehash.hash(result)],
    onSuccess(data: any) {
      // console.log('Success resolver', data)
      setRecordPrepared(true)
    },
    onError(error) {
      console.log('Error resolver', error)
    },
  })

  const { data: addresses } = useContractRead({
    address: PublicResolver.address as `0x${string}`,
    abi: AddrResolver.abi,
    functionName: 'addr',
    enabled: prepared && recordPrepared,
    args: [namehash.hash(result)],
    onError(error) {
      console.log('Error addr', error)
    },
  })

  // console.log('namehash.hash(result)', namehash.hash(result))

  const textsPrepare = keysTexts.map((item, index) => ({
    address: PublicResolver.address as `0x${string}`,
    abi: TextResolver.abi,
    functionName: 'text',
    args: [namehash.hash(result), item],
  }))

  const { data: arrTextsField } = useContractReads({
    contracts: textsPrepare as any,
    enabled: prepared && recordPrepared,
    onSuccess(data: any) {
      console.log('Success texts', data)
    },
    onError(error) {
      console.log('Error texts', error)
    },
  })

  console.table({
    addresses: addresses,
    resolver: resolver,
    checkOwnerDomain: checkOwnerDomain,
  })

  return (
    <>
      {/* Records / Addresses */}
      <>
        <div className="flex-col bg-gray-800 px-8 pb-14">
          {/* Record Line -- Button Add/Edit Records */}
          <div className="flex-col justify-between mb-10 md:flex md:flex-row">
            {/* Records */}
            <h1 className="text-white text-2xl font-semibold">Records</h1>
            {/* Add/Edit Record buttons Desktop */}
            {!recordsEditMode && checkOwnerDomain && (
              <button
                onClick={() => editModeFunc()}
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
                  {/* <button
                    onClick={() => save()}
                    className="flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] hover:scale-105 transform transition duration-300 ease-out lg:ml-auto"
                  >
                    <p className="text-xs font-medium">Save</p>
                  </button> */}
                </div>
              </>
            )}
          </div>

          {/* Addressess Section */}
          <div className="flex flex-col lg:flex-row pb-14">
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

          {/* Text Records Section */}
          <div className="flex-col bg-gray-800 pb-14">
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
            {!recordsEditMode && checkOwnerDomain && (
              <button
                onClick={() => editModeFunc()}
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
                  {/* <button
                    onClick={() => save()}
                    className="flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] lg:ml-auto"
                  >
                    <p className="text-xs font-medium">Save</p>
                  </button> */}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </>
  )
}

/**
 <>
      <div className="flex-col bg-gray-800 px-8 pb-14">
        <h1 className="text-white text-2xl font-semibold mb-10">Records</h1>

        
        <div className="flex flex-col lg:flex-row">
          <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0">
            Addresses
          </h2>
          <div className="flex-col items-center">
            {listAddresses.map((item, index) => (
              <RecordSection
                key={index}
                leftText={item.leftText}
                rightText={item.rightText}
              />
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-col bg-gray-800 px-8 pb-14 rounded-b-md">
        <div className="flex flex-col lg:flex-row">
          <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0">
            Text Records
          </h2>
          <div className="flex-col items-center">
            {arrTextsField?.map((item: any, index: any) => (
              <RecordSection
                key={index}
                leftText={keysTexts[index]}
                rightText={item}
              />
            ))}
          </div>
        </div>
      </div>
    </>
 */
