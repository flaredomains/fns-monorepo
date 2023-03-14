import React, { useState } from 'react'
import Image from 'next/image'
import ArrowDown from '../../public/ArrowDown.svg'

const arrFAQ = [
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
    subText: 'AAA',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
    subText: 'BBB',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
    subText: 'CCC',
  },
]

const FAQ_Line = ({ text, subText }: { text: string; subText: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex-col px-4 py-4 border-b border-gray-600 cursor-pointer"
      >
        {/* Text */}
        <div className="flex justify-between items-center">
          <p className="text-base font-medium text-gray-200">{text}</p>
          <Image className="h-2 w-3" src={ArrowDown} alt="FNS" />
        </div>
        {/* SubText */}
        <p
          className={`${
            isOpen ? 'block' : 'hidden'
          } py-4 text-gray-500 font-normal text-sm`}
        >
          {subText}
        </p>
      </div>
    </>
  )
}

export default function FAQ() {
  return (
    <>
      <div className="flex-col w-full mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        <div className="flex-col bg-gray-800 px-4 py-16 w-full rounded-md lg:px-32">
          <div className="flex-col bg-gray-700 w-full px-8 py-8 rounded-lg">
            <p className="text-white font-bold mb-6 px-4 text-4xl">
              Frequently Asked Questions
            </p>
            {arrFAQ.map((item, index) => (
              <FAQ_Line key={index} text={item.text} subText={item.subText} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
