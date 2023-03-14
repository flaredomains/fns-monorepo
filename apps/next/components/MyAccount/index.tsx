import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import MyAccount from '../../public/MyAccount.svg'
import Search from '../../public/Search.svg'
import Avatar from '../../public/Avatar.svg'
import WalletConnect from '../WalletConnect'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const AccountLine = () => {
  const { address, isConnected } = useAccount() as any

  const router = useRouter()
  const [route, setRoute] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    router.push('register/' + route)
  }
  return (
    <>
      <div className="flex items-center py-5 border-b border-gray-700">
        <div className="flex-col items-center w-full lg:flex lg:flex-row lg:w-1/2">
          <Image
            className="h-11 w-11 mr-6 mb-4 lg:mb-0"
            src={MyAccount}
            alt="FNS"
          />
          <div className="flex-col mr-7">
            <p className="text-gray-400 font-normal text-sm">
              {isConnected
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : 'Not Connected'}
            </p>
            <p className="text-white font-bold text-3xl py-2">My Account</p>
            <p className="text-gray-400 font-normal text-sm">
              Manage Your Domain Here
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="hidden lg:flex items-center w-1/2 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500"
        >
          <Image className="z-10 h-6 w-6 mr-2" src={Search} alt="FNS" />
          <input
            type="text"
            onChange={(e) => {
              setRoute(e.target.value)
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-500 placeholder:font-normal"
            placeholder="Search New Names or Addresses"
            required
          />
        </form>
      </div>
    </>
  )
}

const OwnedDomains = ({ date }: { date: Date }) => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  return (
    <>
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center">
          {/* Avatar */}
          <Image className="h-8 w-8 mr-2" src={Avatar} alt="FNS" />
          {/* Domain */}
          <p className={`text-white font-semibold text-base cursor-pointer`}>
            neel.flr
          </p>
        </div>
        <div className="flex items-center">
          {/* Date exp */}
          <div className="flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3">
            <p className="text-gray-300 text-xs font-medium">
              Expires {`${month}/${day}/${year}`}
            </p>
          </div>
          {/* Action Button */}
          <button className="hidden items-center justify-center cursor-pointer border border-white px-3 py-2 rounded-lg lg:flex">
            <p className="text-white font-medium text-xs">Action</p>
          </button>
        </div>
      </div>
    </>
  )
}

export default function index({
  arrSubdomains,
}: {
  arrSubdomains: Array<any>
}) {
  const date = new Date(1678273065000)
  return (
    <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <AccountLine />

        <div className="flex-col py-4 mb-4 mt-10">
          <p className="text-white font-semibold text-lg mb-2">Owned Domains</p>
          <p className="text-gray-400 font-medium text-sm">
            Manage Your Account Here
          </p>
        </div>

        <div className="flex-col bg-gray-800">
          {arrSubdomains.map((item, index) => (
            <OwnedDomains key={index} date={date} />
          ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  )
}
