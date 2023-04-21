import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Avatar from '../../public/Avatar.svg'
import WalletConnect from '../WalletConnect'
import Link from 'next/link'
import AccountLine from './AccountLine'
import Reverse_Record from './Reverse_Record'

import { useAccount, useContract, useProvider, useContractRead } from 'wagmi'

import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
import MintedIds from '../../src/pages/abi/MintedIds.json'
import ETHRegistrarController from '../../src/pages/abi/ETHRegistrarController.json'
import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'

import web3 from 'web3-utils'
import { ethers } from 'ethers'

const OwnedDomains = ({ date, domain }: { date: Date; domain: string }) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
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
              query: { result: domain + '.flr' },
            }}
          >
            <p
              className={`text-white font-semibold text-base cursor-pointer hover:underline hover:underline-offset-2`}
            >
              {domain}.flr
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

type Domain = {
  label: string
  expire: number
}

export default function MyAccount() {
  const [isOpen, setIsOpen] = useState(false)
  const [addressDomain, setAddressDomain] = useState<Array<Domain>>([])

  const { address, isConnected } = useAccount()

  const date = new Date(1678273065000)

  const { data } = useContractRead({
    address: MintedIds.address as `0x${string}`,
    abi: MintedIds.abi,
    functionName: 'getAll',
    enabled: isConnected,
    args: [address],
    onSuccess(data: any) {
      console.log('Success getAll', data)
      const ownedDomain = data.map((item: any, index: any) => {
        return {
          label: item.label,
          expire: Number(item.expiry),
        }
      })
      setAddressDomain(ownedDomain)
    },
    onError(error) {
      console.error('Error getAll', error)
    },
  })

  // console.log('addressDomain', addressDomain)

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false)
      }}
      className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full"
    >
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <AccountLine />

        {isConnected && (
          <Reverse_Record
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            addressDomain={addressDomain}
          />
        )}

        <div className="flex-col py-4 mb-4 mt-10">
          <p className="text-white font-semibold text-lg mb-2">Owned Domains</p>
          <p className="text-gray-400 font-medium text-sm">
            Manage Your Account Here
          </p>
        </div>

        <div className="flex-col bg-gray-800">
          {isConnected &&
            addressDomain.map((item, index) => (
              <OwnedDomains
                key={index}
                date={new Date(item.expire ? item.expire * 1000 : '')}
                domain={item.label}
              />
            ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  )
}
