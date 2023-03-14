import React, { useState } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'

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
              ? `${rightText.slice(0, 6)}...${rightText.slice(-4)}`
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

export default function Content() {
  return (
    <>
      <div className="flex-col bg-gray-800 px-8 pb-14">
        <h1 className="text-white text-2xl font-semibold mb-10">Records</h1>
        <div className="flex flex-col lg:flex-row">
          {/* Addresses */}
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
          {/* Text Records */}
          <h2 className="text-white text-xl font-semibold w-32 mr-10 mb-4 lg:mb-0">
            Text Records
          </h2>
          <div className="flex-col items-center">
            {listTextRecords.map((item, index) => (
              <RecordSection
                key={index}
                leftText={item.leftText}
                rightText={item.rightText}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
