import React, { useState } from 'react'
import Question from '../../public/Question.svg'
import Plus from '../../public/Plus.svg'
import Image from 'next/image'
import SubdomainLine from './SubdomainLine'

const AddSubdomain = ({ arrSubdomains }: { arrSubdomains: Array<any> }) => {
  return (
    <>
      <div className='flex-col lg:flex lg:flex-row items-center bg-gray-800 px-8 py-12'>
        {/* No subdomains have been added yet */}
        {typeof arrSubdomains !== 'undefined' && arrSubdomains.length === 0 && (
          <div className='flex w-full lg:w-3/4 bg-gray-500 py-3 px-5 rounded-lg mr-4'>
            <Image className='h-4 w-4 mr-2' src={Question} alt='FNS' />
            <div className='flex-col'>
              <p className='text-gray-200 font-semibold text-sm'>
                No subdomains have been added yet
              </p>
            </div>
          </div>
        )}
        {/* Button */}
        <button className='flex justify-center items-center text-center bg-[#F97316] h-11 w-1/2 rounded-lg text-white px-auto mt-5 md:w-1/4 lg:mt-0 lg:ml-auto'>
          <p className='text-xs font-medium mr-2'>Add Subdomain</p>
          <Image className='h-4 w-4' src={Plus} alt='FNS' />
        </button>
      </div>
    </>
  )
}

export default function SubdomainContent({
  arrSubdomains,
  date,
  editMode,
  setEditMode,
  setDataEdit,
}: {
  arrSubdomains: Array<any>
  date: Date
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  setDataEdit: React.Dispatch<React.SetStateAction<any[]>>
}) {
  return (
    <>
      <AddSubdomain arrSubdomains={arrSubdomains} />

      {arrSubdomains.length > 0 && (
        <div className='flex-col bg-gray-800 px-8 py-5'>
          {arrSubdomains.map((item) => (
            <>
              <SubdomainLine
                data={item}
                date={date}
                setEditMode={setEditMode}
                editMode={editMode}
                setDataEdit={setDataEdit}
              />
            </>
          ))}
        </div>
      )}
    </>
  )
}
