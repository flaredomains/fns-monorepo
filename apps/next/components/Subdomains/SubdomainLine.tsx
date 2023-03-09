import React, { useState } from 'react'
import Avatar from '../../public/Avatar.svg'
import Delete from '../../public/Delete.svg'
import Back from '../../public/left-arrow.svg'
import Image from 'next/image'

const Left = ({
  editMode,
  setEditMode,
}: {
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <>
      {/* Image + subdomain */}
      <div className='flex items-center'>
        {editMode && (
          <Image
            onClick={() => setEditMode(false)}
            className='h-6 w-8 cursor-pointer mr-2'
            src={Back}
            alt='FNS'
          />
        )}
        <Image className='h-8 w-8 mr-2' src={Avatar} alt='FNS' />
        <p className='text-white font-semibold text-base'>neel.flr</p>
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

  function enabledEditMode() {
    // put value of data in the variable for SubdomainEdit component
    setDataEdit(data)
    setEditMode(true)
  }

  return (
    <>
      {/* Date exp / Edit Button / Delete */}
      <div className='flex items-center'>
        {/* Date exp */}
        <div className='hidden md:flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3'>
          <p className='text-gray-300 text-xs font-medium'>
            Expires {`${month}/${day}/${year}`}
          </p>
        </div>
        {/* Edit */}
        {!editMode && (
          <>
            <button
              onClick={() => enabledEditMode()}
              className='flex items-center h-8 px-3 border border-white rounded-lg mr-3'
            >
              <p className='text-white font-medium text-xs'>Edit</p>
            </button>
            <Image className='h-5 w-5 cursor-pointer' src={Delete} alt='FNS' />
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
      <div className='flex items-center justify-between px-6 mb-7'>
        <Left editMode={editMode} setEditMode={setEditMode} />
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
