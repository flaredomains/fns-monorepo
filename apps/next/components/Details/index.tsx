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

import { useAccount, useContractRead, useContract } from 'wagmi'
import { BigNumber } from 'ethers'

export default function Details({ result }: { result: string }) {
  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [expiredReady, setExpiredReady] = useState<boolean>(false)
  const [tokenPrepared, setTokenPrepared] = useState(false)
  const [tokenId, setTokenId] = useState<BigNumber>()
  const [isNormalDomain, setIsNormalDomain] = useState<boolean>(true)
  const [parent, setParent] = useState<string>('')
  // const [checkOwnerDomain, setCheckOwnerDomain] = useState<boolean>()

  const { address } = useAccount()

  function getParentDomain(str: string) {
    // Define a regular expression pattern that matches subdomains of a domain that ends with .flr.
    const subdomainPattern = /^([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{2,}\.flr$/i

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
      return '.flr'
    }
  }

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
      // console.log('Success available', data)
      setPrepared(true)
    },
    onError(error) {
      console.log('Error available', error)
    },
  })

  // getFLRTokenId for registrant (owner)
  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'getFLRTokenId',
    enabled: !available && prepared,
    args: [filterResult as string],
    onSuccess(data: any) {
      // console.log('Success getFLRTokenId', data)
      setTokenId(data.tokenId)
      setTokenPrepared(true)
    },
    onError(error) {
      console.error('Error getFLRTokenId', error)
    },
  })

  // Get registrant address (owner)
  const { data: owner } = useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: !available && prepared && tokenPrepared,
    args: [tokenId],
    onSuccess(data) {},
    onError(error) {
      console.error('Error ownerOfLabel', error)
    },
  }) as any

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

  console.table({
    available: available,
    getFLRTokenId: tokenId,
    owner: owner,
    controller: controller,
    expire: Number(expire),
    checkOwnerDomain: address === owner,
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
            parent={parent}
            available={available}
            registrant_address={available ? '' : owner ? owner : ''}
            controller={available ? '' : controller ? controller : ''}
            date={available ? new Date() : new Date(Number(expire) * 1000)}
          />

          {!available && available !== undefined && (
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
