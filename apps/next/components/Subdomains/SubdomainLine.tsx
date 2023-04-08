import React, { useState } from 'react'
import Avatar from '../../public/Avatar.svg'
import Delete from '../../public/Delete.svg'
import Back from '../../public/left-arrow.svg'
import Image from 'next/image'

import ETHRegistrarController from '../../src/pages/abi/ETHRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead } from 'wagmi'

const Left = ({
  data,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: any // To change with wagmi data of the item array selected
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<string>>
}) => {
  function enabledEditMode() {
    // put value of data in the variable for SubdomainEdit component
    if (!editMode) {
      setDataEdit(data)
      setEditMode(true)
    }
  }

  return (
    <>
      {/* Image + subdomain */}
      <div className="flex items-center">
        {editMode && (
          <Image
            onClick={() => setEditMode(false)}
            className="h-6 w-8 cursor-pointer mr-2 hover:scale-125 transform transition duration-100 ease-out"
            src={Back}
            alt="FNS"
          />
        )}
        {/* Avatar -- TODO Change with Avatar user (probably with useEnsAvatar) */}
        <Image className="h-8 w-8 mr-2" src={Avatar} alt="FNS" />

        {/* Domain */}
        <p
          onClick={() => enabledEditMode()}
          className={`text-white font-semibold text-base ${
            !editMode &&
            'cursor-pointer hover:underline hover:underline-offset-2'
          }`}
        >
          {data}
        </p>
      </div>
    </>
  )
}

const Right = ({
  data,
  date,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: any // To change with wagmi data of the item array selected
  date: Date
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<string>>
}) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return (
    <>
      {/* Date exp / Edit Button / Delete */}
      <div className="flex items-center">
        {/* Date exp */}
        <div className="hidden md:flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3">
          <p className="text-gray-300 text-xs font-medium">
            Expires {`${month}/${day}/${year}`}
          </p>
        </div>
        {/* Edit */}
        {!editMode && (
          <>
            <Image
              className="h-5 w-5 cursor-pointer hover:scale-110 transform transition duration-100 ease-out"
              src={Delete}
              alt="FNS"
            />
          </>
        )}
      </div>
    </>
  )
}

export default function SubdomainLine({
  data,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: any // To change with wagmi data of the item array selected
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
      <div className="flex items-center justify-between px-6 mb-7">
        <Left
          data={data}
          editMode={editMode}
          setEditMode={setEditMode}
          setDataEdit={setDataEdit}
        />
        <Right
          data={data}
          date={date ? new Date(date) : new Date()}
          editMode={editMode}
          setEditMode={setEditMode}
          setDataEdit={setDataEdit}
        />
      </div>
    </>
  )
}
