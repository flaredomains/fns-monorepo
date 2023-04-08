import React, { useEffect, useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import Info from './Info'
import Content from './Content'

import ETHRegistrarController from '../../src/pages/abi/ETHRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'

import { sha3_256 } from 'js-sha3'
import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead, useContract } from 'wagmi'

export default function Details({ result }: { result: string }) {
  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')

  // Check if result end with .flr and we do an hash with the resultFiltered for registrant and date
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

  const { address } = useAccount()

  const contract = useContract({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
  })

  // console.log(contract)
  // console.log('Contract Controller Event', contract?.filters.ControllerAdded())

  // const { data: node } = useContractRead({
  //   address: ReverseRegistrar.address as `0x${string}`,
  //   abi: ReverseRegistrar.abi,
  //   functionName: 'node',
  //   // enabled: preparedHash,
  //   args: ['0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2'],
  //   onSuccess(data: any) {
  //     console.log('Success node', data)
  //     const test = web3.asciiToHex(filterResult)
  //     console.log('test', test)
  //     // setPrepared(true)
  //   },
  //   onError(error) {
  //     console.log('Error node', error)
  //   },
  // })

  // const provider = useProvider()
  // console.log('provider', provider)
  // const test = async () => {
  //   const name = await provider.lookupAddress(
  //     '0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2'
  //   )
  //   console.log('name', name)
  // }

  // test()

  // Check if the name is available -- args: filterResult
  const { data: available } = useContractRead({
    address: ETHRegistrarController.address as `0x${string}`,
    abi: ETHRegistrarController.abi,
    functionName: 'available',
    enabled: preparedHash,
    args: [filterResult],
    onSuccess(data: any) {
      console.log('Success available', data)
      setPrepared(true)
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  // Check the registrant -- args: hashHex which is the hash of the filterResult
  const { data: registrant } = useContractRead({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
    functionName: 'ownerOf',
    enabled: !available && prepared,
    args: [hashHex],
    onSuccess(data: any) {
      console.log('Success ownerOf', data)
    },
    onError(error) {
      console.error('Error ownerOf', error)
    },
  })

  // console.log(hashHex)

  const { data: controller } = useContractRead({
    address: ETHRegistrarController.address as `0x${string}`,
    abi: ETHRegistrarController.abi,
    functionName: 'owner',
    enabled: !available && prepared,
    onSuccess(data: any) {
      console.log('Success controller', data)
    },
    onError(error) {
      console.log('Error controller', error)
    },
  })

  const { data: date } = useContractRead({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
    functionName: 'nameExpires',
    enabled: !available && prepared,
    args: [hashHex],
    onSuccess(data: any) {
      console.log('Success nameExpires', Number(data))
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
            registrant_address={available ? '' : registrant ? registrant : ''}
            controller={available ? '' : controller ? controller : ''}
            date={available ? new Date() : new Date(Number(date) * 1000)}
          />

          {!available && available !== undefined && (
            <Content result={result} prepared={prepared} />
          )}
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
