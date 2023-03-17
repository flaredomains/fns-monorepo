import React, { useState } from 'react'
import Avatar from '../../public/Avatar.svg'
import Delete from '../../public/Delete.svg'
import Back from '../../public/left-arrow.svg'
import Image from 'next/image'

const Left = ({
  data,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: any // To change with wagmi data of the item array selected
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<any[]>>
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
          {data.domain}
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
  setDataEdit: React.Dispatch<React.SetStateAction<any[]>>
}) => {
  const day = date.getDate()
  const month = date.getMonth()
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
  date,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: any // To change with wagmi data of the item array selected
  date: Date
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<any[]>>
}) {
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
          date={date}
          editMode={editMode}
          setEditMode={setEditMode}
          setDataEdit={setDataEdit}
        />
      </div>
    </>
  )
}
