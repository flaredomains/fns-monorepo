import React, { useState, useEffect } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import SubdomainContent from './SubdomainContent'
import SubdomainEdit from './SubdomainEdit'

import NameWrapper from '../../src/pages/abi/NameWrapper.json'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead } from 'wagmi'
import { BigNumber } from 'ethers'

export default function Subdomains({
  result,
  arrSubdomains,
}: {
  result: string
  arrSubdomains: Array<any>
}) {
  // const [editMode, setEditMode] = useState(false)

  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [tokenPrepared, setTokenPrepared] = useState(false)
  const [tokenId, setTokenId] = useState<BigNumber>()

  const date = new Date(1678273065000)

  const { address } = useAccount()

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

  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'getFLRTokenId',
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
    enabled: tokenPrepared,
    args: [tokenId],
    onSuccess(data) {},
    onError(error) {
      console.error('Error ownerOfLabel', error)
    },
  }) as any

  console.table({
    result: result,
    owner: owner,
    tokenId: tokenId,
  })
  console.log('owner === address', owner === address)

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          {/* Change with Wagmi Array subdomains */}
          <SubdomainContent
            arrSubdomains={[]}
            checkOwnerDomain={owner === address}
            filterResult={filterResult}
          />
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}

/**
   {/* {editMode && (
            <SubdomainEdit
              data={dataEdit}
              editMode={editMode}
              setEditMode={setEditMode}
              setDataEdit={setDataEdit}
            />
          )} 
 */
