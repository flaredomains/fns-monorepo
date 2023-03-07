import React from 'react'
import Plus from '../public/Plus.svg'
import X from '../public/X.svg'
import Network from '../public/Network.svg'
import Image from "next/image";

function WalletConnect({isConnect}: any) {
  return (
    <>
      {/* Wallet connect */}
      <div className='hidden lg:flex lg:w-1/4'>
        <div className='flex-col justify-center items-center w-full h-80 bg-gray-800 rounded-lg px-1 xl:px-7'>
          {
            isConnect ? 
            <>
              {/* Badge -- Icon wallet connected */}
              <div className='mt-20 flex justify-center items-center bg-[#334155] h-6 text-white px-auto rounded-full mx-auto'>
                <Image className='h-4 w-4 mr-2' src={Network} alt="FNS" />
                <p className='text-xs font-medium'>Main Network</p>
              </div>
              {/* Messages */}
              <p className='text-white font-bold text-xl mt-2 text-center'>Your wallet is connected</p>
              <p className='text-[#94A3B8] text-[0.625rem] mt-2 text-center'>Address</p>
            </>
            :
            <>
              {/* Badge -- Icon wallet not connected */}
              <div className='mt-20 flex justify-center items-center bg-[#334155] h-6 text-white px-auto rounded-full mx-auto'>
                <Image className='h-4 w-4 mr-2' src={X} alt="FNS" />
                <p className='text-xs font-medium'>Wallet Not Connected</p>
              </div>
              {/* Messages */}
              <p className='text-white font-bold text-xl mt-2 text-center'>Your wallet is not connected</p>
              <p className='text-[#94A3B8] text-[0.625rem] mt-2 text-center'>Please connect your wallet to register your FNS domain.</p>
              {/* Connect Wallet */}
              <div className='mt-4 mb-12 flex justify-center items-center text-center bg-[#F97316] h-8 rounded-lg text-white px-auto mx-auto'>
                <p className='text-base font-semibold mr-2'>Connect Your Wallet</p>
                <Image className='h-4 w-4' src={Plus} alt="FNS" />
              </div>
            </>
          }
          
        </div>
      </div>
    </>
  )
}

export default WalletConnect