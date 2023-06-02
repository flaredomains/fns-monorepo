import React from 'react'
import Avatar from '../../public/Avatar.svg'
import Image from 'next/image'

const namehash = require('eth-ens-namehash')

const Left = ({ domain }: { domain: string }) => {
  return (
    <>
      {/* Image + subdomain */}
      <div className="flex items-center">
        {/* Avatar */}
        <Image className="h-8 w-8 mr-2" src={Avatar} alt="Avatar" />

        {/* Domain */}
        <p
          className={`text-white font-semibold text-base ${
            // !editMode &&
            'cursor-pointer hover:underline hover:underline-offset-2'
          }`}
        >
          {domain}
        </p>
      </div>
    </>
  )
}

const Right = ({ owner }: { owner: string }) => {
  return (
    <>
      {/* Date exp / Edit Button / Delete */}
      <div className="flex items-center">
        {/* Date exp */}
        <div className="hidden md:flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3">
          <p className="text-gray-300 text-xs font-medium">
            Owner{' '}
            {owner ? `${owner?.slice(0, 6)}...${owner?.slice(-4)}` : 'n/a'}
          </p>
        </div>
      </div>
    </>
  )
}

export default function SubdomainLine({
  domain,
  owner,
}: {
  domain: string
  owner: string
}) {
  return (
    <>
      <div className="flex items-center justify-between px-6 mb-7">
        <Left domain={domain} />
        <Right owner={owner} />
      </div>
    </>
  )
}
