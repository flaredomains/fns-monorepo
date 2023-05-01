import React, { useEffect, useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import Info from './Info'
import Content from './Content'

import FLRRegistrarController from '../../src/pages/abi/FLRRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
// import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'
import NameWrapper from '../../src/pages/abi/nameWrapper.json'

import { sha3_256 } from 'js-sha3'
import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead, useContract } from 'wagmi'
import { BigNumber } from 'ethers'

export default function Details({ result }: { result: string }) {
  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [expiredReady, setExpiredReady] = useState<boolean>(false)
  const [tokenId, setTokenId] = useState<BigNumber>()

  // Check if result end with .flr and we do an hash with the resultFiltered for registrant and date
  useEffect(() => {
    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log('Ethereum address')
      setFilterResult(result)
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

  // const { address } = useAccount()

  // Check if the name is available -- args: filterResult
  const { data: available } = useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
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
  // const { data: registrant } = useContractRead({
  //   address: BaseRegistrar.address as `0x${string}`,
  //   abi: BaseRegistrar.abi,
  //   functionName: 'ownerOf',
  //   enabled: !available && prepared,
  //   args: [hashHex],
  //   onSuccess(data: any) {
  //     console.log('Success ownerOf', data)
  //   },
  //   onError(error) {
  //     console.error('Error ownerOf', error)
  //   },
  // })

  const { isFetched: tokerReady } = useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'getFLRTokenId',
    enabled: !available && prepared,
    args: [filterResult as string],
    onSuccess(data: any) {
      console.log('Success getFLRTokenId', data)
      setTokenId(data.tokenId)
    },
    onError(error) {
      console.error('Error getFLRTokenId', error)
    },
  })

  const { data: owner } = useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: !available && prepared && tokerReady,
    args: [tokenId],
    onSuccess(data: any) {
      console.log('Success ownerOfLabel', data)
    },
    onError(error) {
      console.error('Error ownerOfLabel', error)
    },
  })

  const { data: controller } = useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'owner',
    enabled: !available && prepared,
    onSuccess(data: any) {
      console.log('Success controller', data)
    },
    onError(error) {
      console.log('Error controller', error)
    },
  })

  const { data: getLabelId } = useContractRead({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
    functionName: 'getLabelId',
    enabled: !available && prepared,
    args: [filterResult],
    onSuccess(data: any) {
      // console.log('Success getLabelId', Number(data))
      setExpiredReady(true)
    },
    onError(error) {
      console.log('Error getLabelId', error)
    },
  })

  const { data: expire } = useContractRead({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
    functionName: 'expiries',
    enabled: expiredReady,
    args: [getLabelId as BigNumber],
    onSuccess(data: any) {
      // console.log('Success expire', Number(data))
    },
    onError(error) {
      console.log('Error expire', error)
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
            registrant_address={available ? '' : owner ? owner : ''}
            controller={available ? '' : controller ? controller : ''}
            date={available ? new Date() : new Date(Number(expire) * 1000)}
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
