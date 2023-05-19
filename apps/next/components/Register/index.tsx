import React, { useState, useEffect } from 'react'
import Like from '../../public/Like.svg'
import Dislike from '../../public/Dislike.svg'
import WalletConnect from '../WalletConnect'
import Image from 'next/image'
import Domain_Select from '../Domain_Select'
import Selector from './Selector'
import Final_price from './Final_price'
import Steps from './Steps'
import Bottom from './Bottom'
import web3 from 'web3-utils'

import FLRRegistrarController from '../../src/pages/abi/FLRRegistrarController.json'
import PublicResolver from '../../src/pages/abi/PublicResolver.json'

import {
  useFeeData,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
  useContract,
  useSigner,
  useAccount,
} from 'wagmi'
import { BigNumber, ethers } from 'ethers'

export enum RegisterState {
  Uncommitted, // this is the default begin state (count => 0)
  Committable, // reflects if commit will succeed or not (if there's a valid commitment already or not)
  Committing, // committing transaction in progress
  Waiting, // committing transaction complete, waiting timer in progress (count => 1)
  Unregistered, // timer complete, pending register transaction (count => 2)
  Registering, // registering transaction in progress
  Registered, // registration complete (count => 3)
}

const Alert = ({ available }: { available: boolean }) => {
  return (
    <>
      <div className="flex w-full bg-[#F97316] py-3 px-5 rounded-lg">
        <Image
          className={`h-4 w-4 mr-2 ${!available && 'mt-1'}`}
          src={available ? Like : Dislike}
          alt="FNS"
        />
        <div className="flex-col">
          <p className="text-white font-semibold text-sm">
            {available
              ? 'This name is available!'
              : 'This name is already registered.'}
          </p>
          <p className="text-white font-normal text-sm mt-2">
            {available
              ? 'Please complete the form below to secure this domain for yourself.'
              : 'Please check the Details tab to see when this domain will free up.'}
          </p>
        </div>
      </div>
    </>
  )
}

const StepTitle = () => {
  return (
    <>
      <div className="hidden items-center mt-12 lg:flex">
        <div className="bg-[#F97316] h-8 w-8 rounded-full mr-4" />
        <p className="text-white font-semibold text-lg">
          Registering requires 3 steps
        </p>
      </div>
    </>
  )
}

export default function Register({ result }: { result: string }) {
  // For steps animation
  const [count, setCount] = useState(0)

  const [priceFLR, setPriceFLR] = useState('1')
  const [regPeriod, setRegPeriod] = useState(1)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [isNormalDomain, setIsNormalDomain] = useState<boolean>(true)
  const [registerState, setRegisterState] = useState<RegisterState>(
    RegisterState.Uncommitted
  )

  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()

  function getParentDomain(str: string) {
    // Define a regular expression pattern that matches subdomains of a domain that ends with .flr.
    const subdomainPattern = /^([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{1,}\.flr$/i

    // Use the regular expression pattern to test whether the string matches a subdomain.
    const isSubdomain = subdomainPattern.test(str)
    console.log('isSubdomain', isSubdomain)

    if (isSubdomain) {
      // The input string is a subdomain, extract the parent domain.
      const parts = str.split('.')
      const numParts = parts.length
      const parentDomain = parts.slice(numParts - (numParts - 1)).join('.')
      setIsNormalDomain(false)
      return parentDomain
    } else {
      return str
    }
  }

  useEffect(() => {
    const parent = getParentDomain(result)
    // console.log('parent', parent)
    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log('Ethereum address')
      setFilterResult(result)
    } else if (result) {
      // Remove .flr from result for READ/WRITE function purposes and get hash
      const resultFiltered = result.endsWith('.flr')
        ? result.slice(0, -4)
        : result
      const hash = web3.sha3(resultFiltered) as string
      setFilterResult(resultFiltered)
      setHashHex(hash)
      setPreparedHash(true)
    }
  }, [result])

  // Available READ function
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'available',
    enabled: preparedHash,
    args: [filterResult],
    onSuccess(data: any) {
      // console.log('Success available', data)
      // data is a boolean that represents if the domain is available or not
      if (data) {
        setRegisterState(RegisterState.Uncommitted)
      } else {
        setRegisterState(RegisterState.Registered)
      }
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  // RentPrice READ function
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'rentPrice',
    args: [filterResult as string, regPeriod * 31556952], // 31536000
    onSuccess(data: any) {
      // console.log('Success rentPrice', data)
      // console.log('Base', Number(data.base))
      // console.log('Base', ethers.utils.formatEther(data.base))
      // console.log('Premium', Number(data.premium))
      setPriceFLR(data.base)
    },
    onError(error) {
      console.log('Error rentPrice', error)
    },
  })

  const { data: fee } = useFeeData()

  const contract = useContract({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    signerOrProvider: signer,
  })

  const incrementYears = () => {
    if (regPeriod >= 999) return
    setRegPeriod(regPeriod + 1)
  }

  const decreaseYears = () => {
    if (regPeriod === 1) return
    if (regPeriod < 1) {
      setRegPeriod(1)
    }
    setRegPeriod(regPeriod - 1)
  }

  // console.table({
  //   result: result,
  //   filterResult: filterResult,
  //   hashHex: hashHex,
  //   priceFLR: priceFLR,
  //   regPeriod: regPeriod,
  //   isNormalDomain: isNormalDomain,
  // })

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          <div className="flex-col bg-gray-800 px-8 py-12 rounded-b-lg">
            <Alert
              available={
                isNormalDomain && registerState !== RegisterState.Registered
              }
            />
            {isNormalDomain && registerState !== RegisterState.Registered && (
              <>
                {/* Increment Selector */}
                <Selector
                  regPeriod={regPeriod}
                  priceToPay={priceFLR}
                  incrementYears={incrementYears}
                  decreaseYears={decreaseYears}
                />

                {/* Final price block */}
                <Final_price
                  regPeriod={regPeriod}
                  fee={Number(fee?.gasPrice)}
                  priceToPay={priceFLR}
                />

                {/* Steps title mobile hidden */}
                <StepTitle />

                {/* Steps */}
                <Steps count={count} />

                <Bottom
                  result={filterResult}
                  regPeriod={regPeriod}
                  price={priceFLR}
                  count={count}
                  setCount={setCount}
                  registerState={registerState}
                  setRegisterState={setRegisterState}
                />
              </>
            )}
          </div>
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
