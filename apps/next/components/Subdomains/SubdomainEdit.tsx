import React, { useState, useEffect } from 'react'
import SubdomainLine from './SubdomainLine'
import SubDetails from './SubDetails'
import Records from './Records'

import FLRRegistrarController from '../../src/pages/abi/FLRRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead } from 'wagmi'

export default function SubdomainEdit({
  data,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: string
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<string>>
}) {
  const { data: date } = useContractRead({
    address: BaseRegistrar.address as `0x${string}`,
    abi: BaseRegistrar.abi,
    functionName: 'nameExpires',
    enabled: editMode,
    args: [
      web3.sha3(data.endsWith('.flr') ? data.slice(0, -4) : data) as string,
    ],
    onSuccess(data: any) {
      console.log('Success nameExpires', Number(data))
    },
    onError(error) {
      console.log('Error nameExpires', error)
    },
  })

  return (
    <>
      {/* Subdomain Line */}
      <div className="flex-col bg-gray-800 px-8 pb-5 pt-11">
        <SubdomainLine
          data={data}
          editMode={editMode}
          setEditMode={setEditMode}
          setDataEdit={setDataEdit}
        />
      </div>
      {/* Details */}
      <SubDetails
        data={data}
        date={date ? new Date(date) : new Date()}
        editMode={editMode}
      />

      {/* Records / Addresses */}
      <Records data={data} editMode={editMode} />
    </>
  )
}
