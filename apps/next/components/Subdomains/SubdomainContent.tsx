import React, { useEffect, useState } from 'react'
import Question from '../../public/Question.svg'
import Plus from '../../public/Plus.svg'
import Image from 'next/image'
import SubdomainLine from './SubdomainLine'
import Link from 'next/link'

import { ens_normalize_fragment } from "@adraffy/ens-normalize";

import NameWrapper from '../../src/pages/abi/NameWrapper.json'
import PublicResolver from '../../src/pages/abi/PublicResolver.json'

import { keccak256 } from 'js-sha3'

import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'
import { BigNumber, ethers } from 'ethers'

const namehash = require('eth-ens-namehash')
import web3 from 'web3-utils'

const AddSubdomain = ({
  arrSubdomains,
  checkOwnerDomain,
  filterResult,
  refetchFn
}: {
  arrSubdomains: Array<any>
  checkOwnerDomain: boolean
  filterResult: string
  refetchFn: any
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isInputValid, setIsInputValid] = useState<boolean>(false)

  // This effect ensures that subdomains will not contain a "." or any other illegal characters
  // TODO: Add an "illegal character" message underneath the form input when isInputValid is false
  useEffect(() => {
    try{
      if(input.includes(".")) {
        throw Error("disallowed character: \".\"");
      }

      const result = ens_normalize_fragment(input);
      setIsInputValid(true);
    }
    catch(error) {
      setIsInputValid(false);
    }
  }, [input])

  const { address } = useAccount()

  const { config: configSetSubnodeRecord } = usePrepareContractWrite({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'setSubnodeRecord',
    enabled: input !== '',
    args: [
      namehash.hash(filterResult + '.flr'),     // bytes32:  parentNode
      input as string,                          // string:   label
      address as `0x${string}`,                 // address:  newOwner
      PublicResolver.address as `0x${string}`,  // address:  resolver
      0,                                        // uint64:   ttl
      0,                                        // uint32:   fuses
      0                                         // uint64:   expiry (0 because its a subdomain)
    ],
    onSuccess(data) {
      // console.log('Success prepare setSubnodeRecord', data)
    },
    onError(error) {
      // console.log('Error prepare setSubnodeRecord', error)
    },
  })

  const { write: setSubnodeRecord } = useContractWrite({
    ...configSetSubnodeRecord,
    async onSuccess(data) {
      await data.wait(1);
      refetchFn();
      console.log('Success setSubnodeRecord', data)
      // redirect?
      setIsOpen(false);
    },
    onError(error) {
      // console.log('Error setSubnodeRecord', error)
    },
  })

  // console.table({
  //   namehash: namehash.hash(filterResult + '.flr'),
  //   input: input,
  //   filterResult: filterResult + '.flr',
  //   PublicResolverAddress: PublicResolver.address,
  //   address: address,
  //   keccak: `0x${keccak256(input)}`,
  // })

  // console.log(object);

  return (
    <>
      <div className="flex flex-row items-center mt-5 bg-gray-800 px-8 py-12 lg:mt-0">
        {isOpen ? (
          <>
            <form
              className={`${isInputValid ? 'border-gray-500' : 'border-red-500'} flex items-center w-3/5 py-2 px-4 h-12 rounded-md bg-gray-700 border-2`}
            >
              <input
                type="text"
                name="input-field"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                }}
                className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal focus:bg-transparent"
                placeholder="Type in a label for your subdomain"
                required
              />
            </form>
            <div className="items-center flex ml-auto">
              {/* Cancel */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 border border-gray-400 rounded-lg mr-2 hover:scale-105 transform transition duration-300 ease-out"
              >
                <p className="text-gray-400 text-medium text-xs">Cancel</p>
              </button>

              {/* Save */}
              <button
                onClick={() => setSubnodeRecord?.()}
                disabled={!isInputValid || input === ""}
                type="submit"
                value="Submit"
                className="flex justify-center items-center text-center bg-[#F97316] px-3 py-2 rounded-lg text-white border border-[#F97316] hover:scale-105 transform transition duration-300 ease-out lg:ml-auto disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100"
              >
                <p className="text-xs font-medium">Save</p>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* No subdomains have been added yet */}
            {typeof arrSubdomains !== 'undefined' &&
              arrSubdomains.length === 0 && (
                <div
                  className={`flex w-full ${
                    checkOwnerDomain ? `lg:w-3/4` : 'lg:w-full'
                  } bg-gray-500 py-3 px-5 rounded-lg mr-4`}
                >
                  <Image className="h-4 w-4 mr-2" src={Question} alt="FNS" />
                  <div className="flex-col">
                    <p className="text-gray-200 font-semibold text-sm">
                      No subdomains have been added yet
                    </p>
                  </div>
                </div>
              )}
            {/* Button */}
            {checkOwnerDomain && (
              <button
                onClick={() => setIsOpen(true)}
                className="flex justify-center items-center text-center bg-[#F97316] h-11 w-1/2 rounded-lg text-white px-auto hover:scale-105 transform transition duration-100 ease-out md:w-1/4 lg:ml-auto"
              >
                <p className="text-xs font-medium mr-2">Add Subdomain</p>
                <Image className="h-4 w-4" src={Plus} alt="FNS" />
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default function SubdomainContent({
  arrSubdomains,
  checkOwnerDomain,
  filterResult,
  refetchFn,
}: {
  arrSubdomains: Array<any>
  checkOwnerDomain: boolean
  filterResult: string
  refetchFn: any
}) {
  return (
    <>
      <AddSubdomain
        arrSubdomains={arrSubdomains}
        checkOwnerDomain={checkOwnerDomain}
        filterResult={filterResult}
        refetchFn={refetchFn}
      />

      {arrSubdomains.length > 0 && (
        <div className="flex-col bg-gray-800 px-8 py-5 rounded-b-md">
          {arrSubdomains.map((item) => (
            <Link
              key={item.domain}
              href={{
                pathname: '/details',
                query: { result: item.domain },
              }}
            >
              <SubdomainLine key={item.domain} domain={item.domain} owner={item.owner} />
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
