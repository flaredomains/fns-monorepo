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

import ETHRegistarController from '../../src/pages/abi/ETHRegistrarController.json'

import {
  useFeeData,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi'

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
  const [regPeriod, setRegPeriod] = useState(1)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')

  useEffect(() => {
    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log('Ethereum address')
      setFilterResult(result)
      // setHashHex(hash)
      // setPreparedHash(true)
    } else if (result) {
      const resultFiltered = result.endsWith('.flr')
        ? result.slice(0, -4)
        : result
      const hash = web3.sha3(resultFiltered) as string
      setFilterResult(resultFiltered)
      setHashHex(hash)
      setPreparedHash(true)
    }
  }, [result])

  const { data: available } = useContractRead({
    address: ETHRegistarController.address as `0x${string}`,
    abi: ETHRegistarController.abi,
    functionName: 'available',
    enabled: preparedHash,
    args: [filterResult],
    onSuccess(data: any) {
      console.log('Success available', data)
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  const { data: price } = useContractRead({
    address: ETHRegistarController.address as `0x${string}`,
    abi: ETHRegistarController.abi,
    functionName: 'rentPrice',
    args: [result as string, regPeriod],
    onSuccess(data: any) {
      console.log('Success rentPrice', data)
      console.log('Base', Number(data.base))
    },
    onError(error) {
      console.log('Error rentPrice', error)
    },
  })

  const { data: fee } = useFeeData()

  // console.log('ETHRegistarController.address', ETHRegistarController.address)
  // console.log('ETHRegistarController.abi', ETHRegistarController.abi)

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

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          <div className="flex-col bg-gray-800 px-8 py-12 rounded-b-md">
            <Alert available={available} />
            {available && (
              <>
                {/* Increment Selector */}
                <Selector
                  regPeriod={regPeriod}
                  priceToPay={Number(price?.base)}
                  incrementYears={incrementYears}
                  decreaseYears={decreaseYears}
                />

                {/* Final price block */}
                <Final_price
                  regPeriod={regPeriod}
                  fee={Number(fee?.gasPrice)}
                  priceToPay={Number(price?.base)}
                />

                {/* Steps title mobile hidden */}
                <StepTitle />

                {/* Steps */}
                <Steps />

                <Bottom />
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
