import React, { useState } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'

import ENSRegistry from '../../src/pages/abi/ENSRegistry.json'
import PublicResolver from '../../src/pages/abi/PublicResolver.json'

import { useContractRead, useContractReads } from 'wagmi'

const namehash = require('eth-ens-namehash')

const listAddresses: Array<{ leftText: string; rightText: string }> = [
  { leftText: 'XTP', rightText: '0x880426bb362Bf481d6891839f1B0dAEB57900591' },
  { leftText: 'BTC', rightText: '' },
  { leftText: 'LTC', rightText: '' },
  { leftText: 'DOGE', rightText: '' },
]

const listTextRecords: Array<{ leftText: string; rightText: string }> = [
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
  'eth.ens.delegate',
]

const keysAddr: Array<string> = ['XTP', 'BTC', 'LTC', 'DOGE']

const RecordSection = ({
  leftText,
  rightText,
}: {
  leftText: string
  rightText: string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(rightText)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <>
      <div className="flex flex-col mb-3 lg:flex-row">
        <p className="w-32 text-white font-medium text-xs mr-6">{leftText}</p>
        <div className="flex items-center mt-2 lg:mt-0">
          <p
            className={`${
              rightText ? 'text-[#F97316]' : 'text-gray-400'
            } font-medium text-xs mr-3`}
          >
            {rightText
              ? `${
                  /^0x/.test(rightText) // Check if is an address or normal test
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
        </div>
      </div>
    </>
  )
}

export default function Content({
  result,
  prepared,
}: {
  result: String
  prepared: boolean
}) {
  const [recordPrepared, setRecordPrepared] = useState(false)

  const { data: records } = useContractRead({
    address: ENSRegistry.address as `0x${string}`,
    abi: ENSRegistry.abi,
    functionName: 'resolver',
    enabled: prepared,
    args: [namehash.hash(result)],
    onSuccess(data: any) {
      console.log('Success resolver', data)
      setRecordPrepared(true)
    },
    onError(error) {
      console.log('Error resolver', error)
    },
  })

  const { data: addresses } = useContractRead({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: 'addr',
    enabled: prepared && recordPrepared,
    args: [namehash.hash(result)],
    onSuccess(data: any) {
      console.log('Success addr', data)
    },
    onError(error) {
      console.log('Error addr', error)
    },
  })

  // console.log('namehash.hash(result)', namehash.hash(result))
  const { data: owner } = useContractRead({
    address: ENSRegistry.address as `0x${string}`,
    abi: ENSRegistry.abi,
    functionName: 'owner',
    enabled: prepared && recordPrepared,
    args: [namehash.hash(result)],
    onSuccess(data: any) {
      console.log('Success owner', data)
    },
    onError(error) {
      console.log('Error owner', error)
    },
  })

  const textsPrepare = keysTexts.map((item, index) => ({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
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

  return (
    <>
      <div className="flex-col bg-gray-800 px-8 pb-14">
        <h1 className="text-white text-2xl font-semibold mb-10">Records</h1>

        {/* Addresses */}
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

      {/* Text Records */}
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
  )
}
