import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ArrowDown from '../../public/ArrowDown.svg'

import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'
import PublicRegistrar from '../../src/pages/abi/PublicResolver.json'

const namehash = require('eth-ens-namehash')

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

const Rev_Record_Line = ({
  text,
  setSelectText,
}: {
  text: string
  setSelectText: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <p
        onClick={() => setSelectText(text)}
        className="py-4 px-3 text-gray-200 font-normal text-sm cursor-pointer hover:bg-gray-500"
      >
        {text}
      </p>
    </>
  )
}

const Dropdown = ({
  isOpen,
  setIsOpen,
  addressDomain,
  selectText,
  setSelectText,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  addressDomain: Array<Domain>
  selectText: string
  setSelectText: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex-col cursor-pointer relative w-full md:w-full lg:w-1/2"
      >
        <div className="flex justify-between items-center p-3 w-full mt-7 bg-gray-700 rounded-lg">
          <p
            className={`text-base font-medium ${
              selectText ? 'text-gray-200' : 'text-gray-400'
            }`}
          >
            {selectText ? selectText : 'Select Your FNS Name'}
          </p>
          <Image className="h-2 w-3" src={ArrowDown} alt="FNS" />
        </div>
        <div
          className={`${
            isOpen ? 'absolute' : 'hidden'
          } bg-gray-700 w-full mt-2 rounded-lg`}
        >
          {addressDomain.map((item, index) => (
            <Rev_Record_Line
              key={index}
              text={item.label}
              setSelectText={setSelectText}
            />
          ))}
        </div>
      </div>
    </>
  )
}

type Domain = {
  label: string
  expire: number
}

export default function Reverse_Record({
  isOpen,
  setIsOpen,
  addressDomain,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  addressDomain: Array<Domain>
}) {
  const [isLarge, setisLarge] = useState(false)
  const [selectText, setSelectText] = useState('')
  const [prepared, setPrepared] = useState(false)
  const [writeFuncHash, setWriteFuncHash] = useState('')

  const { address, isConnected } = useAccount()

  useEffect(() => {
    // First render
    if (window.innerWidth >= 1024) {
      setisLarge(window.innerWidth >= 1024)
    }

    const handleResize = () => {
      setisLarge(window.innerWidth >= 1024)
    }

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener('resize', handleResize)

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data: node, isFetched } = useContractRead({
    address: ReverseRegistrar.address as `0x${string}`,
    abi: ReverseRegistrar.abi,
    functionName: 'node',
    args: [address],
    onSuccess(data: any) {
      console.log('Success node: ', data)
    },
    onError(error) {
      console.log('Error node', error)
    },
  })

  // NameResolver Name
  const { data: mainDomain, refetch: refetchMainDomain } = useContractRead({
    address: PublicRegistrar.address as `0x${string}`,
    abi: PublicRegistrar.abi,
    functionName: 'name',
    enabled: isConnected && isFetched,
    args: [node],
    onSuccess(data: any) {
      console.log('Success name: ', data)
    },
    onError(error) {
      console.log('Error name', error)
    },
  })

  //  SetName Prepare selectText + '.flr'
  const { config: prepareSetName } = usePrepareContractWrite({
    address: ReverseRegistrar.address as `0x${string}`,
    abi: ReverseRegistrar.abi,
    functionName: 'setName',
    args: [selectText],
    enabled: isConnected && selectText !== '',
    onSuccess(data: any) {
      console.log('Success prepareSetName', data)
      // setPrepared(true)
    },
    onError(error) {
      console.log('Error prepareSetName', error)
    },
  })

  // SetName Write Func
  const { write: setName, isSuccess } = useContractWrite({
    ...prepareSetName,
    onSuccess(data) {
      console.log('Success setName', data)
      setWriteFuncHash(data.hash)
    },
  }) as any

  const { data } = useWaitForTransaction({
    hash: writeFuncHash as `0x${string}`,
    enabled: isSuccess && writeFuncHash,
    onSuccess(data) {
      console.log('Success setName block', data)
      refetchMainDomain()
    },
  })

  return (
    <>
      <div className="flex justify-between mt-16">
        {/* Text */}
        <p className="text-white font-semibold text-lg">
          {isLarge ? 'Primary FNS Name (Reverse Record)' : 'Primary FNS Name'}
          {mainDomain ? ` : ${mainDomain}.flr` : ''}
        </p>
        {/* Button */}
        <div
          onClick={() => setName?.()}
          className="flex items-center px-3 py-1 bg-[#F97316] rounded-full cursor-pointer hover:scale-110 active:scale-125 transform transition duration-300 ease-out lg:py-2 lg:px-4"
        >
          <p className="text-white text-sm font-medium">Set Name</p>
        </div>
      </div>

      {/* Text */}
      <p className="mt-2 w-full font-normal text-sm text-gray-400 lg:w-3/5">
        This sets one of your FNS names to represent your Flare account and
        becomes your Web3 username and profile. You may only use one per account
        and can change it at any time.
      </p>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        addressDomain={addressDomain}
        selectText={selectText}
        setSelectText={setSelectText}
      />

      {/* Text */}
      <p className="mt-2 w-full font-normal text-sm text-gray-400 lg:w-1/2">
        Only FNS Domains you own can be used here
      </p>
    </>
  )
}
