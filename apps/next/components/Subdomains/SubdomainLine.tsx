import React, { useState } from 'react'
import Avatar from '../../public/Avatar.svg'
import Delete from '../../public/Delete.svg'
import Back from '../../public/left-arrow.svg'
import Image from 'next/image'

import FLRRegistrarController from '../../src/pages/abi/FLRRegistrarController.json'
import BaseRegistrar from '../../src/pages/abi/BaseRegistrar.json'
import ReverseRegistrar from '../../src/pages/abi/ReverseRegistrar.json'

import web3 from 'web3-utils'
const namehash = require('eth-ens-namehash')

import { useAccount, useContractRead } from 'wagmi'

const Left = ({
  domain
}: {
  domain: string
}) => {
  return (
    <>
      {/* Image + subdomain */}
      <div className="flex items-center">
        {/* Avatar -- TODO Change with Avatar user (probably with useEnsAvatar) */}
        <Image className="h-8 w-8 mr-2" src={Avatar} alt="FNS" />

        {/* Domain */}
        <p
          // onClick={() => enabledEditMode()}
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

const Right = ({
  owner
}: {
  owner: string
}) => {
  return (
    <>
      {/* Date exp / Edit Button / Delete */}
      <div className="flex items-center">
        {/* Date exp */}
        <div className="hidden md:flex items-center bg-gray-700 rounded-lg h-6 px-3 mr-3">
          <p className="text-gray-300 text-xs font-medium">
            Owner {owner ? `${owner?.slice(0, 6)}...${owner?.slice(-4)}` : "n/a"}
          </p>
        </div>
        {/* {!editMode && (
          <>
            <Image
              className="h-5 w-5 cursor-pointer hover:scale-110 transform transition duration-100 ease-out"
              src={Delete}
              alt="FNS"
            />
          </>
        )} */}
      </div>
    </>
  )
}

export default function SubdomainLine({
  domain,
  owner
} : {
  domain: string,
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
