import React, { useEffect, useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import Info from './Info'
import Content from './Content'

import FLRRegistrarController from '../../src/pages/abi/FLRRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
// import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'
import NameWrapper from '../../src/pages/abi/NameWrapper.json'

import { sha3_256 } from 'js-sha3'
import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000'

import { useAccount, useContractRead, useContract, Address } from 'wagmi'
import { BigNumber, utils } from 'ethers'

export default function Details({ result }: { result: string }) {
  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [expiredReady, setExpiredReady] = useState<boolean>(false)
  //const [tokenPrepared, setTokenPrepared] = useState<boolean>(false)
  const [tokenId, setTokenId] = useState<BigNumber>()
  const [isSubdomain, setIsSubdomain] = useState<boolean>(false)
  const [parent, setParent] = useState<string>('')
  // const [checkOwnerDomain, setCheckOwnerDomain] = useState<boolean>()
  const [isAvailable, setIsAvailable] = useState<boolean>(true)

  const { address } = useAccount()

  function getParentDomain(str: string) {
    // Define a regular expression pattern that matches subdomains of a domain that ends with .flr.
    const subdomainPattern = /^([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.flr$/i
    // /^([a-zA-Z0-9-]+)\.{1}([a-zA-Z0-9-]+)\.{1}flr$/i

    // Use the regular expression pattern to test whether the string matches a subdomain.
    const isSubdomain = subdomainPattern.test(str)
    console.log('isSubdomain', str, isSubdomain)
    setIsSubdomain(isSubdomain)

    if (isSubdomain) {
      // The input string is a subdomain, extract the parent domain.
      const parts = str.split('.')
      const numParts = parts.length
      const parentDomain = parts.slice(numParts - (numParts - 1)).join('.')
      return parentDomain
    } else {
      return 'flr'
    }
  }

  useEffect(() => {
    console.log('isAvailable changed', isAvailable)
  }, [isAvailable])

  useEffect(() => {
    console.log('isSubdomain changed', isSubdomain)
  }, [isSubdomain])

  // Check if result end with .flr and we do an hash with the resultFiltered for registrant and date
  useEffect(() => {
    const parent = getParentDomain(result)
    setParent(parent)
    console.log('parent', parent)

    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log('Ethereum address')
      setFilterResult(result)
    } else if (result) {
      setTokenId(BigNumber.from(utils.namehash(result)))

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

  // Normal Domains: Is name available
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'available',
    enabled: preparedHash && !isSubdomain,
    args: [filterResult],
    onSuccess(data: any) {
      console.log('Details::FLRRegistrarController::available()', data)
      setPrepared(true)
      setIsAvailable(data)
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  // Subdomains: Is name available
  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: preparedHash && isSubdomain,
    args: [tokenId],
    onSuccess(data: string) {
      console.log(
        'Details::NameWrapper::ownerOf()',
        data,
        data === ZERO_ADDRESS,
        'isSubdomain:',
        isSubdomain
      )
      setIsAvailable(data === ZERO_ADDRESS)
    },
    onError(error) {
      console.log('Error ownerOf', error)
    },
  })

  // Get registrant address (owner)
  const { data: owner } = useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: !isAvailable && prepared,
    args: [tokenId],
    onSuccess(data) {},
    onError(error) {
      console.error('Error ownerOf', error)
    },
  }) as any

  const { data: controller } = useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'owner',
    enabled: !isAvailable && prepared,
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
    enabled: !isAvailable && prepared,
    args: [filterResult],
    onSuccess(data: any) {
      console.log('Success getLabelId', data)
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

  // console.table({
  //   result: result,
  //   isAvailable: isAvailable,
  //   isSubdomain: isSubdomain,
  //   getFLRTokenId: tokenId,
  //   owner: owner,
  //   controller: controller,
  //   expire: Number(expire),
  //   checkOwnerDomain: address === owner,
  // })

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          <Info
            parent={parent}
            isSubdomain={isSubdomain}
            available={isAvailable}
            registrant_address={isAvailable ? '' : owner ? owner : ''}
            controller={isAvailable ? '' : controller ? controller : ''}
            date={isAvailable ? new Date() : new Date(Number(expire) * 1000)}
          />

          {!isAvailable && isAvailable !== undefined && (
            <Content
              result={result}
              prepared={prepared}
              checkOwnerDomain={address === owner}
            />
          )}
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
