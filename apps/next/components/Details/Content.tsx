import React, { useState, useEffect } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'
import Plus from '../../public/Plus.svg'
import Delete from '../../public/Delete.svg'

import FNSRegistry from '../../src/pages/abi/FNSRegistry.json'
import PublicResolver from '../../src/pages/abi/PublicResolver.json'

import { formatsByName } from '@ensdomains/address-encoder'

// namehash is available as an ethers utility!
// utils.namehash(richard.flr) = 0xc8d20c7e2a8b02d98d5b47f6edefe94d581bcf829d44172f9f449aaa00e952b2
import { utils, Bytes } from 'ethers'

import {
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'

const listAddresses: Array<{ leftText: string; rightText: string }> = [
  { leftText: 'ETH', rightText: '' },
  { leftText: 'BTC', rightText: '' },
  { leftText: 'LTC', rightText: '' },
  { leftText: 'DOGE', rightText: '' },
]

const listTextRecords: Array<{ leftText: string; rightText: string }> = [
  { leftText: 'Email', rightText: '' },
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

const textKeys: Array<string> = [
  'Email',
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

// Mock address data for various chains here:
// https://docs.ens.domains/ens-improvement-proposals/ensip-9-multichain-address-resolution
const addressKeys: Array<string> = ['ETH', 'BTC', 'LTC', 'DOGE']

// Regular expression that matches for any text or address record
// that has been set! ie any record that is not "" or "0x"
const recordIsSet = /[^(^0x$|^$)]/

// leftText ---> key -- ex. ETH,BTC,... or email,URL
// rightText ---> value -- ex. addrETH, addrBTC,... or simone@elevatesoftware.io,....
// addressRecord --- if is Address field or Text Record field
const Info = ({
  namehash,
  leftText,
  rightText,
  index,
  recordsEditMode,
  addressRecord,
  coinType,
  refetch,
  deleteButton,
  setRecordsEditMode,
}: {
  namehash: string
  leftText: string
  rightText: string
  index: number
  coinType?: number
  recordsEditMode: boolean
  addressRecord: boolean
  refetch: any
  deleteButton: (addressRecord: boolean, index: number) => void
  setRecordsEditMode: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [copied, setCopied] = useState(false)
  const [input, setInput] = useState('')
  const [addressInputIsValid, setAddressInputValid] = useState<boolean>(false)
  const [addressAsBytes, setAddressAsBytes] = useState<Bytes>([])

  const handleCopy = () => {
    // Return the formatted version since rightText is the plain "hex" string.
    navigator.clipboard.writeText(formattedRecord())
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  // Validates address record inputs using @ensdomains/address-encoder
  useEffect(() => {
    if (addressRecord && input !== '') {
      try {
        // formatsByName always returns valid for ETH addresses, so use ethersjs instead
        if (leftText === 'ETH') {
          if (!utils.isAddress(input)) {
            throw Error('Invalid ETH Address')
          }
          setAddressAsBytes(utils.arrayify(utils.getAddress(input)))
        } else {
          setAddressAsBytes(formatsByName[leftText].decoder(input))
        }
        setAddressInputValid(true)
      } catch (error) {
        setAddressInputValid(false)
      }
    }
  }, [input])

  // WAGMI TEXT RECORD WRITE FUNCTION, active when === false
  // setText(namehash(domainName), keyString, valueString)
  // Example Usage:
  // To set email:
  // setText(namehash, "email", "simone@gmail.com")
  const { config: prepareSetText } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: 'setText',
    args: [namehash, leftText.toLowerCase(), input],
    enabled: !addressRecord && input !== '',
    onSuccess(data: any) {
      console.log('Success prepareSetText', data)
    },
    onError(error) {
      console.log('Error prepareSetText', error)
    },
  })

  // Write function for 'setText' call to set a text record on PublicResolver.
  const { write: writeSetText } = useContractWrite({
    ...prepareSetText,
    async onSuccess(data) {
      console.log('Success writeSetText', data)

      // Waits for 1 txn confirmation (block confirmation)
      await data.wait(1)

      refetch()
      setRecordsEditMode(false)
      setInput('')
    },
  }) as any

  // WAGMI ADDRESSES RECORD WRITE FUNCTION, active when addressRecord and addressInputIsValid are true
  // setAddr(bytes32 node, uint256 coinType, bytes a)
  // Example Usage:
  // To set BTC:
  // setAddr(namehash, 0, 0x76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac)
  const { config: prepareSetAddr } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: 'setAddr',
    args: [namehash, coinType, addressAsBytes],
    enabled: addressRecord && coinType !== undefined && addressInputIsValid,
    onSuccess(data: any) {
      console.log('Success prepareSetAddr', data)
      console.log(namehash, coinType, addressAsBytes)
    },
    onError(error) {
      console.log('Error prepareSetAddr', error)
    },
  })

  // Write function for 'setAddr' call to set an address record on PublicResolver.
  const { write: writeSetAddr } = useContractWrite({
    ...prepareSetAddr,
    onSuccess(data) {
      console.log('Success writeSetAddr', data)
    },
  }) as any

  // Returns the string version of any text or address record type
  // that has been set and returns "Not Set" otherwise.
  const formattedRecord = () => {
    // if a text or address record is not set, return not set
    if (recordIsSet.test(rightText)) {
      // address record
      if (addressRecord) {
        if (rightText) {
          // https://docs.ens.domains/dapp-developer-guide/resolving-names#listing-cryptocurrency-addresses-and-text-records
          return formatsByName[leftText].encoder(
            Buffer.from(utils.arrayify(rightText))
          )
        }
      }
      // text record
      else {
        return rightText
      }
    }
    return 'Not Set'
  }

  return (
    <>
      <div className="flex flex-col mb-3 lg:flex-row lg:items-start">
        <p className="w-32 text-white font-medium text-xs mr-6 shrink-0">
          {leftText}
        </p>
        {/* Not Edit section */}
        <div className="gap-2 flex flex-col items-start lg:flex-row lg:items-center">
          {!recordsEditMode && (
            <>
              <p
                className={`${
                  // if a text or address record are not set, set text color to gray!
                  recordIsSet.test(rightText)
                    ? 'text-[#F97316]'
                    : 'text-gray-400'
                } font-medium text-xs mr-3 mt-2 lg:mt-0`}
              >
                {formattedRecord()}
              </p>
              {copied ? (
                <>
                  <p className="text-[#F97316] font-medium text-sm items-center">
                    Copied
                  </p>
                </>
              ) : (
                rightText && (
                  <Image
                    onClick={handleCopy}
                    className="h-4 w-4 cursor-pointer items-center"
                    src={Clipboard_copy}
                    alt="FNS"
                  />
                )
              )}
            </>
          )}
        </div>
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
            {/* Save -- setText or setAddr (based on addressRecord variable) */}
            {input !== '' && (
              <button
                onClick={
                  addressRecord
                    ? () => writeSetAddr?.() // setAddr write function
                    : () => writeSetText?.() // setText write function
                }
                disabled={addressRecord && !addressInputIsValid}
                className="flex justify-center items-center text-center bg-[#F97316] px-2 py-1 rounded-lg text-white border border-[#F97316] lg:ml-auto disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100"
              >
                <p className="text-xs font-medium">Set</p>
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
  result: string
  prepared: boolean
  checkOwnerDomain: boolean
}) {
  const [recordPrepared, setRecordPrepared] = useState(false)

  const [recordsEditMode, setRecordsEditMode] = useState<boolean>(false)
  const [arrAddresses, setArrAddresses] =
    useState<Array<{ leftText: string; rightText: string }>>(listAddresses)
  const [arrTextRecords, setArrTextRecords] =
    useState<Array<{ leftText: string; rightText: string }>>(listTextRecords)
  const [copyArrAddr, setCopyArrAddr] =
    useState<Array<{ leftText: string; rightText: string }>>(listAddresses)
  const [copyArrTextRecords, setCopyArrTextRecords] =
    useState<Array<{ leftText: string; rightText: string }>>(listTextRecords)

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
  function deleteButton(addressRecord: boolean, index: number) {
    if (addressRecord) {
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
    args: [utils.namehash(result)],
    onSuccess(data: any) {
      console.log('Success resolver', data)
      setRecordPrepared(true)
    },
    onError(error) {
      console.log('Error resolver', error)
    },
  })

  // DONE: Read the addr(bytes32 node, uint256 coinType)
  // DONE: coinType can be retrieved using: formatsByName[leftText].coinType, where leftText == 'BTC', 'LTC', etc
  // DONE: Reference the useEffects and useState for coinType in the Info component
  // DONE: Perhaps it would be best to "lift" coinType state up one level so this parent component
  //       also has access to it

  // Prepares an array of read objects on the PublicResolver contract
  // for every available address record type defined in `addressKeys`.
  const addressRecordReads = addressKeys.map((coin) => ({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: 'addr',
    args: [utils.namehash(result), formatsByName[coin].coinType],
  }))

  // Performs all of the reads for the address record types and
  // returns an array of "hex" strings corresponding to each type.
  const { data: addressRecords } = useContractReads({
    contracts: addressRecordReads as [
      {
        address?: `0x${string}`
        abi?: any
        functionName?: string
        args?: [any, number]
      }
    ],
    enabled: prepared && recordPrepared,
    onSuccess(data: any) {
      console.log('Success addresses', data)
    },
    onError(error) {
      console.log('Error addresses', error)
    },
  })

  console.log('addressRecords', addressRecords)
  console.log('prepared && recordPrepared', prepared, recordPrepared)

  // Prepares an array of read objects on the PublicResolver contract
  // for every available text record type defined in `addressKeys`.
  const textRecordReads = textKeys.map((item) => ({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: 'text',
    args: [utils.namehash(result), item.toLowerCase()],
  }))

  // Performs all of the reads for the text record types and
  // returns an array of strings corresponding to each type.
  const { data: textRecords, refetch: refetchText } = useContractReads({
    contracts: textRecordReads as [
      {
        address?: `0x${string}`
        abi?: any
        functionName?: string
        args?: [any, number]
      }
    ],
    enabled: prepared && recordPrepared,
    onSuccess(data: any) {
      console.log('Success texts', data)
    },
    onError(error) {
      console.log('Error texts', error)
    },
  })

  console.log('textRecords', textRecords)

  return (
    <>
      {/* Records / Addresses */}
      <>
        <div className="flex-col bg-gray-800 px-8 pb-14 rounded-b-lg">
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
              {addressRecords ? (
                copyArrAddr.map((item, index) => (
                  <Info
                    key={index}
                    namehash={utils.namehash(result)}
                    leftText={item.leftText}
                    rightText={addressRecords[index] as string}
                    index={index}
                    recordsEditMode={recordsEditMode}
                    addressRecord={true}
                    coinType={formatsByName[item.leftText].coinType}
                    refetch={refetchText}
                    setRecordsEditMode={setRecordsEditMode}
                    deleteButton={deleteButton}
                  />
                ))
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Text Records Section */}
          <div className="flex-col bg-gray-800 pb-14 w-full">
            <div className="flex flex-col lg:flex-row w-full">
              {/* Text Records */}
              <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0 shrink-0">
                Text Records
              </h2>
              <div className="flex-col items-center">
                {textRecords ? (
                  copyArrTextRecords.map((item, index) => (
                    <Info
                      key={index}
                      namehash={utils.namehash(result)}
                      leftText={item.leftText}
                      rightText={textRecords[index] as string}
                      index={index}
                      recordsEditMode={recordsEditMode}
                      addressRecord={false}
                      refetch={refetchText}
                      setRecordsEditMode={setRecordsEditMode}
                      deleteButton={deleteButton}
                    />
                  ))
                ) : (
                  <></>
                )}
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
            {textRecords?.map((item: any, index: any) => (
              <RecordSection
                key={index}
                leftText={textKeys[index]}
                rightText={item}
              />
            ))}
          </div>
        </div>
      </div>
    </>
 */
