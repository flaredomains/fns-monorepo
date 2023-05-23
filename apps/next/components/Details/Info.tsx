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
  rightText: string | undefined;
  alternativeText: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rightText ? rightText : "");
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
        {rightText || rightText === "" ? (
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
        ) : (
          <>
            <div className="grid items-center w-full h-5">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1 grid grid-cols-5">
                  <div className="h-2 bg-slate-600 rounded col-span-3"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const Alert = ({ available }: { available: boolean | undefined }) => {
  return (
    <>
      <div className="flex w-full bg-gray-500 py-3 px-5 rounded-lg items-center">
        {available !== undefined ? (
          <>
            <Image
              className="h-4 w-4 mr-2"
              src={available ? Like : Dislike}
              alt="FNS"
            />
            <p className="text-gray-200 font-semibold text-sm">
              {available
                ? "This name is available!"
                : "This name is already registered"}
            </p>
          </>
        ) : (
          <div className="grid items-center w-full h-5">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-600 h-4 w-4"></div>
              <div className="flex-1 space-y-6 py-1 grid grid-cols-5">
                <div className="h-2 bg-slate-600 rounded col-span-3"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function Info({
  available,
  isSubdomain,
  isCollision,
  parent,
  registrant_address,
  controller,
  dateNumber,
}: {
  available: boolean | undefined;
  isSubdomain: boolean;
  isCollision: boolean;
  parent: string;
  registrant_address: string;
  controller: string;
  dateNumber: number;
}) {
  const date = new Date(dateNumber)

  return (
    <>
      <div
        className={`flex-col bg-gray-800 px-8 py-12 ${
          available ? "rounded-b-lg" : "rounded-b-none"
        }`}
      >
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
            leftText={isSubdomain ? 'Owner' : 'Registrant'}
            rightText={registrant_address}
            alternativeText="0x0"
          />

          {/* Controller */}
          {!isSubdomain && (
            <InfoLine
              leftText="Controller"
              rightText={controller}
              alternativeText="Not Owned"
            />
          )}

          {/* Expiration Date */}
          {available !== undefined ? (
            !available && (
              <div className="flex-col items-center w-full mb-6 lg:flex lg:flex-row">
                <p className="font-semibold text-white text-base w-32 mr-12">
                  Expiration Date
                </p>
                <div className="flex-col items-center mt-2 lg:mt-0 lg:flex lg:flex-row">
                  <p className="font-semibold text-white text-base mr-12">
                    {isSubdomain || isCollision
                    ? 'No Expiry'
                    : `${date?.toLocaleString('en-US', {
                        month: 'long',
                        })} ${date?.getDate()}, ${date?.getFullYear()}`}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="grid items-center w-full h-5">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-x-4 py-1 grid grid-cols-7">
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  <div className="h-2 col-span-1"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  <div className="h-2 col-span-4"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
