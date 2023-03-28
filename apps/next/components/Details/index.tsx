import React, { useEffect, useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import Info from './Info'
import Content from './Content'

import ETHRegistarController from '../../src/pages/abi/ETHRegistrarController.json'
import BaseRegistar from '../../src/pages/abi/BaseRegistrar.json'

import { sha3_256 } from 'js-sha3'
import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead, useContract } from 'wagmi'

export default function Details({ result }: { result: string }) {
  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState('')

  useEffect(() => {
    // console.log('Enter in the useEffect')
    if (result) {
      const resultFiltered = result.endsWith('.flr')
        ? result.slice(0, -4)
        : result
      const hash = web3.sha3(resultFiltered) as string
      setFilterResult(resultFiltered)
      setHashHex(hash)
      setPreparedHash(true)
    }
  }, [result])

  // const filterResult = result.endsWith('.flr') ? result.slice(0, -4) : result
  // const hashHex = web3.sha3(filterResult) as string
  // const hashHex = web3.sha3(filterResult)

  // console.log(result)
  // console.log('hashHex full result:', sha3_256(result))
  // console.log('hashHex filter result:', sha3_256(filterResult))
  // console.log('web3 sha3 full result:', web3.sha3(result))
  // console.log('web3 sha3 filter result:', hashHex)
  // console.log('namehash full result:', namehash.hash(result))
  // console.log('namehash filter result:', namehash.hash(filterResult))

  const { address } = useAccount()

  const contract = useContract({
    address: BaseRegistar.address as `0x${string}`,
    abi: BaseRegistar.abi,
  })

  // console.log(contract)
  // console.log(
  //   'Contract Controller Event',
  //   contract?.filters.ControllerAdded().topics
  // )

  const { data: available } = useContractRead({
    address: ETHRegistarController.address as `0x${string}`,
    abi: ETHRegistarController.abi,
    functionName: 'available',
    enabled: preparedHash,
    args: [hashHex],
    onSuccess(data: any) {
      console.log('Success available', data)
      setPrepared(true)
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  const { data: registrant } = useContractRead({
    address: BaseRegistar.address as `0x${string}`,
    abi: BaseRegistar.abi,
    functionName: 'ownerOf',
    enabled: !available && prepared,
    args: [hashHex],
    onSuccess(data: any) {
      console.log('Success ownerOf', data)
    },
    onError(error) {
      console.log('Error ownerOf', error)
    },
  })

  const { data: controller } = useContractRead({
    address: ETHRegistarController.address as `0x${string}`,
    abi: ETHRegistarController.abi,
    functionName: 'owner',
    enabled: !available && prepared,
    // args: [tokenId as string], TokenID ???
    onSuccess(data: any) {
      console.log('Success owner', data)
    },
    onError(error) {
      console.log('Error owner', error)
    },
  })

  const { data: date } = useContractRead({
    address: BaseRegistar.address as `0x${string}`,
    abi: BaseRegistar.abi,
    functionName: 'nameExpires',
    enabled: !available && prepared,
    args: [hashHex],
    onSuccess(data: any) {
      console.log('Success nameExpires', data)
    },
    onError(error) {
      console.log('Error nameExpires', error)
    },
  })

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          <Info
            available={available}
            registrant_address={available ? '' : registrant}
            controller={available ? '' : controller}
            date={available ? new Date() : date}
          />

          {!available && <Content result={filterResult} prepared={prepared} />}
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
