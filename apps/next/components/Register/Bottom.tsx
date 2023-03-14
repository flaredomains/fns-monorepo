import React from 'react'
import Info from '../../public/Info.svg'
import Plus from '../../public/Plus.svg'
import Image from 'next/image'
import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'

export default function Bottom() {
  const { address, isConnected } = useAccount() as any

  return (
    <>
      {/* Connect Wallet -- Hidden Mobile */}
      <div className="mt-10 flex items-center w-full">
        {/* Info icon + Message */}
        {isConnected ? (
          <>
            <div className="mt-10 flex justify-center items-center w-full">
              <button className="flex justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out">
                <p className="text-base font-semibold mr-2">
                  Request to Register
                </p>
                <Image className="h-4 w-4" src={Plus} alt="FNS" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-2/3 flex items-center bg-[#334155] h-12 rounded-lg text-[#9cacc0] px-5 mr-4">
              <Image className="h-4 w-4 mr-2" src={Info} alt="FNS" />
              <p className="text-xs font-medium">
                No wallet connected. Please connect to continue.
              </p>
            </div>
            <div
              className={`w-1/3 flex justify-center items-center h-12 rounded-lg text-white px-auto`}
            >
              <Web3Button icon="hide" label="Connect Wallet" balance="hide" />
            </div>
          </>
        )}
      </div>
    </>
  )
}
