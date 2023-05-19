import React, { useState, useEffect } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import SubdomainContent from './SubdomainContent'

import { useRouter } from 'next/router'

import NameWrapper from '../../src/pages/abi/NameWrapper.json'
import SubdomainTracker from '../../src/pages/abi/SubdomainTracker.json'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead } from 'wagmi'
import { BigNumber } from 'ethers'

export default function Subdomains({ result }: { result: string }) {
  // const [editMode, setEditMode] = useState(false)

  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')
  const [tokenPrepared, setTokenPrepared] = useState(false)
  const [tokenId, setTokenId] = useState<BigNumber>()
  const [arrSubdomains, setArrSubdomains] = useState<Array<string>>([])

  const date = new Date(1678273065000)

  const { address } = useAccount()

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as string
    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log('Ethereum address')
      setFilterResult(result)
    } else if (result) {
      if (result !== '') {
        setTokenId(BigNumber.from(namehash.hash(result)))
      }

      const resultFiltered = result.endsWith('.flr')
        ? result.slice(0, -4)
        : result
      const hash = web3.sha3(resultFiltered) as string
      setFilterResult(resultFiltered)
      setHashHex(hash)
      setPreparedHash(true)
    }
  }, [router.isReady, router.query])

  // Read all subdomains under a given domain name
  const { refetch: refGetAll } = useContractRead({
    address: SubdomainTracker.address as `0x${string}`,
    abi: SubdomainTracker.abi,
    functionName: 'getAll',
    enabled: tokenId !== undefined,
    args: [tokenId],
    onSuccess(data: any) {
      const subdomains = data.data.map((x: any) => ({
        domain: `${x.label}.${result}`,
        owner: x.owner,
        tokenId: x.id,
      }))
      setArrSubdomains(subdomains)
    },
    onError(error) {
      console.error('SubdomainTracker::getAll Error', error)
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

  // console.table({
  //   result: result,
  //   owner: owner,
  //   tokenId: tokenId,
  // })
  // console.log('owner === address', owner === address)

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
            arrSubdomains={arrSubdomains}
            checkOwnerDomain={owner === address}
            filterResult={filterResult}
            refetchFn={refGetAll}
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
