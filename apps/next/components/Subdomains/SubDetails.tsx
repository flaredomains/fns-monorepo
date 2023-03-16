import React, { useState, useEffect } from 'react'
import Clipboard_copy from '../../public/Clipboard_copy.svg'
import Image from 'next/image'

const InfoLine = ({
  leftText,
  rightText,
  alternativeText,
}: {
  leftText: string
  rightText: string
  alternativeText: string
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
      <div className="flex-col items-center w-full mb-6 lg:flex lg:flex-row">
        <p className="font-semibold text-white text-base w-32 mr-12">
          {leftText}
        </p>
        <div className="flex items-center mt-2 lg:mt-0">
          <p className="font-semibold text-[#F97316] text-base mr-4">
            {rightText
              ? `${
                  /^0x/.test(rightText)
                    ? `${rightText.slice(0, 6)}...${rightText.slice(-4)}`
                    : rightText
                }`
              : alternativeText}
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

  return (
    <>
      <div className="flex-col bg-gray-800 px-8 py-2 md:py-10">
        {/* Details */}
        <div className="flex-col w-full pr-3">
          <InfoLine
            leftText="Parent"
            rightText={'Ripple Network'}
            alternativeText=""
          />
          <InfoLine
            leftText="Registrant"
            rightText={'0x880426bb362Bf481d6891839f1B0dAEB57900591'}
            alternativeText=""
          />
          <InfoLine
            leftText="Controller"
            rightText={'0x880426bb362Bf481d6891839f1B0dAEB57900591'}
            alternativeText=""
          />

          {/* Expiration Date */}
          <div className="flex-col items-center w-full mb-6 lg:flex lg:flex-row">
            <p className="font-semibold text-white text-base w-32 mr-12">
              Expiration Date
            </p>
            <div className="flex-col items-center mt-2 lg:mt-0 lg:flex lg:flex-row">
              <p className="font-semibold text-white text-base mr-12">
                {`${month} ${day}, ${year}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
