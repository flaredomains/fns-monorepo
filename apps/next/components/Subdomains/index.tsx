import React, { useState, useEffect } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import SubdomainContent from './SubdomainContent'
import SubdomainEdit from './SubdomainEdit'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

export default function Subdomains({
  result,
  arrSubdomains,
}: {
  result: string
  arrSubdomains: Array<any>
}) {
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState<Array<any>>([])

  const [prepared, setPrepared] = useState<boolean>(false)
  const [preparedHash, setPreparedHash] = useState<boolean>(false)
  const [hashHex, setHashHex] = useState<string>('')
  const [filterResult, setFilterResult] = useState<string>('')

  const date = new Date(1678273065000)

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

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          {!editMode && (
            <SubdomainContent
              date={date}
              arrSubdomains={arrSubdomains}
              editMode={editMode}
              setEditMode={setEditMode}
              setDataEdit={setDataEdit}
            />
          )}

          {editMode && (
            <SubdomainEdit
              data={dataEdit}
              date={date}
              editMode={editMode}
              setEditMode={setEditMode}
              setDataEdit={setDataEdit}
            />
          )}
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
