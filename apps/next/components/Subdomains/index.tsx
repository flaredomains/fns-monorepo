import React, { useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import SubdomainContent from './SubdomainContent'
import SubdomainEdit from './SubdomainEdit'

export default function Subdomains({
  result,
  arrSubdomains,
}: {
  result: String
  arrSubdomains: Array<any>
}) {
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState<Array<any>>([])

  const date = new Date(1678273065000)

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
