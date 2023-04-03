import React from 'react'
import Image from 'next/image'
import Avatar from '../../public/Avatar.svg'
import WalletConnect from '../WalletConnect'
import Link from 'next/link'
import AccountLine from './AccountLine'
import Reverse_Record from './Reverse_Record'

import { useAccount, useContract } from 'wagmi'

import BaseRegistar from '../../src/pages/abi/BaseRegistrar.json'

const OwnedDomains = ({ date, domain }: { date: Date; domain: string }) => {
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
          <Link
            href={{
              pathname: `details/[result]`,
              query: { result: domain },
            }}
          >
            <p
              className={`text-white font-semibold text-base cursor-pointer hover:underline hover:underline-offset-2`}
            >
              {domain}
            </p>
          </Link>
        </div>
        <div className="flex items-center">
          {/* Date exp */}
          <div className="flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3">
            <p className="text-gray-300 text-xs font-medium">
              Expires {`${month}/${day}/${year}`}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MyAccount({
  arrSubdomains,
}: {
  arrSubdomains: Array<any>
}) {
  const { address } = useAccount()

  const date = new Date(1678273065000)

  const contract = useContract({
    address: BaseRegistar.address as `0x${string}`,
    abi: BaseRegistar.abi,
  })

  // Owned Domain
  console.log('contract', contract?.filters.NameRegistered(null, address, null))

  return (
    <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <AccountLine />

        <Reverse_Record />

        <div className="flex-col py-4 mb-4 mt-10">
          <p className="text-white font-semibold text-lg mb-2">Owned Domains</p>
          <p className="text-gray-400 font-medium text-sm">
            Manage Your Account Here
          </p>
        </div>

        <div className="flex-col bg-gray-800">
          {arrSubdomains.map((item, index) => (
            <OwnedDomains key={index} date={date} domain={item.domain} />
          ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  )
}
