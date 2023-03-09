import React, { useState, useEffect } from 'react'
import SubdomainLine from './SubdomainLine'
import SubDetails from './components/SubDetails'
import Records from './components/Records'

export default function SubdomainEdit({
  data,
  date,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  data: Array<any>
  date: Date // Probably to cancel
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<any[]>>
}) {
  const address = '0x880426bb362Bf481d6891839f1B0dAEB57900591'

  return (
    <>
      {/* Subdomain Line */}
      <div className='flex-col bg-gray-800 px-8 pb-5 pt-11'>
        <SubdomainLine
          data={data}
          date={date}
          editMode={editMode}
          setEditMode={setEditMode}
          setDataEdit={setDataEdit}
        />
      </div>
      {/* Details */}
      <SubDetails address={address} date={date} />

      {/* Records / Addresses */}
      <Records address={address} />
    </>
  )
}
