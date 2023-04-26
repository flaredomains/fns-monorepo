import React from 'react'
import Info from '../../public/Info.svg'
import Plus from '../../public/Plus.svg'
import Minus from '../../public/Minus.svg'
import Image from 'next/image'
import { ethers } from 'ethers'

const Loading = () => {
  return (
    <>
      <div className="animate-pulse mb-1 mr-4">
        <div className="bg-slate-500 h-6 w-20 rounded"></div>
      </div>
    </>
  )
}

const RegistrationPeriod = ({
  decreaseYears,
  regPeriod,
  incrementYears,
}: {
  regPeriod: number
  incrementYears: () => void
  decreaseYears: () => void
}) => {
  return (
    <>
      <div className="flex items-center">
        {/* - */}
        <div
          onClick={decreaseYears}
          className="bg-[#F97316] h-6 w-6 rounded-full text-white text-center mr-5 flex items-center justify-center hover:scale-110 active:scale-125 transform transition duration-300 ease-out"
        >
          <Image className="h-3 w-3" src={Minus} alt="FNS" />
        </div>
        {/* Text */}
        <div className="flex-col">
          <p className="text-white font-semibold text-3xl lg:text-xl xl:text-3xl">
            {regPeriod} year
          </p>
          <p className="text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm">
            Registration Period
          </p>
        </div>
        {/* + */}
        <div
          onClick={incrementYears}
          className="bg-[#F97316] h-6 w-6 rounded-full text-white text-center ml-5 flex items-center justify-center lg:ml-1 hover:scale-110 active:scale-125 transform transition duration-300 ease-out"
        >
          <Image className="h-3 w-3" src={Plus} alt="FNS" />
        </div>
      </div>
    </>
  )
}

// (priceToPay / 10 ** 18).toFixed(4)
const RegPrice = ({
  regPeriod,
  priceToPay,
}: {
  regPeriod: number
  priceToPay: string
}) => {
  return (
    <>
      <div className="flex-col mt-6 lg:mt-0">
        <div className="flex items-center text-white font-semibold text-3xl lg:text-xl xl:text-3xl">
          {priceToPay ? (
            ethers.utils.formatEther(priceToPay).slice(0, 6)
          ) : (
            <Loading />
          )}{' '}
          FLR
        </div>
        <p className="text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm">
          Registration price to pay{' '}
        </p>
      </div>
    </>
  )
}

const Note = () => {
  return (
    <>
      <div className="flex justify-center items-center mt-6 bg-[#334155] h-12 text-[#9cacc0] rounded-lg px-5 w-3/4 lg:w-1/3 lg:mt-0">
        <Image className="h-5 w-5 mr-2" src={Info} alt="FNS" />
        <p className="text-xs font-medium">
          Increase period to avoid paying gas every year
        </p>
      </div>
    </>
  )
}

export default function Selector({
  regPeriod,
  priceToPay,
  incrementYears,
  decreaseYears,
}: {
  regPeriod: number
  priceToPay: string
  incrementYears: () => void
  decreaseYears: () => void
}) {
  return (
    <div className="flex flex-col justify-between items-center mt-9 lg:flex-row">
      <RegistrationPeriod
        decreaseYears={decreaseYears}
        regPeriod={regPeriod}
        incrementYears={incrementYears}
      />

      <RegPrice regPeriod={regPeriod} priceToPay={priceToPay} />

      <Note />
    </div>
  )
}
