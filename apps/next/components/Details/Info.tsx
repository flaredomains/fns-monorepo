import React, { useState } from 'react'
import Like from '../../public/Like.svg'
import Dislike from '../../public/Dislike.svg'
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
        {/* LeftText */}
        <p className="font-semibold text-white text-base w-32 mr-12">
          {leftText}
        </p>

        {/* RightText */}
        <div className="flex items-center mt-2 lg:mt-0">
          <p className="font-semibold text-[#F97316] text-base mr-4">
            {rightText
              ? `${
                  /^0x/.test(rightText) // Check if is an address or normal text
                    ? `${rightText.slice(0, 6)}...${rightText.slice(-4)}`
                    : rightText
                }`
              : alternativeText}
          </p>

          {/* Clipboard */}
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

const Alert = ({ available }: { available: boolean }) => {
  return (
    <>
      <div className="flex w-full bg-gray-500 py-3 px-5 rounded-lg">
        <Image
          className="h-4 w-4 mr-2"
          src={available ? Like : Dislike}
          alt="FNS"
        />
        <div className="flex-col">
          <p className="text-gray-200 font-semibold text-sm">
            {available
              ? 'This name is available!'
              : available !== undefined
              ? 'This name is already registered'
              : 'Error'}
          </p>
        </div>
      </div>
    </>
  )
}

export default function Info({
  available,
  parent,
  registrant_address,
  controller,
  date,
}: {
  available: boolean
  parent: string
  registrant_address: string
  controller: string
  date: Date
}) {
  // if (date) {
  //   const day = date?.getDate()
  //   const month = date?.toLocaleString('en-US', { month: 'long' })
  //   const year = date?.getFullYear()
  // }

  return (
    <>
      <div className="flex-col bg-gray-800 px-8 py-12">
        <Alert available={available} />

        {/* Details */}
        <div className="flex-col w-full mt-10">
          {/* Parent */}
          <InfoLine
            leftText="Parent"
            rightText={parent ? parent : '.flr'}
            alternativeText=""
          />

          {/* Registrant */}
          <InfoLine
            leftText="Registrant"
            rightText={registrant_address}
            alternativeText="0x0"
          />

          {/* Controller */}
          <InfoLine
            leftText="Controller"
            rightText={controller}
            alternativeText="Not Owned"
          />

          {/* Expiration Date */}
          {date && !available && (
            <div className="flex-col items-center w-full mb-6 lg:flex lg:flex-row">
              <p className="font-semibold text-white text-base w-32 mr-12">
                Expiration Date
              </p>
              <div className="flex-col items-center mt-2 lg:mt-0 lg:flex lg:flex-row">
                <p className="font-semibold text-white text-base mr-12">
                  {`${date?.toLocaleString('en-US', {
                    month: 'long',
                  })} ${date?.getDate()}, ${date?.getFullYear()}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
