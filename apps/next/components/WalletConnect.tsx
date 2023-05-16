import React, { useEffect } from 'react'
import Plus from '../public/Plus.svg'
import X from '../public/X.svg'
import Network from '../public/Network.svg'
import Image from 'next/image'
import { Web3Button } from '@web3modal/react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

const WalletConnectSection = () => {
  const { address, isConnected } = useAccount() as any
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    // if(chain?.id !== 14 && chain?.name !== 'Flare') {
    //   switchNetwork?.(14)
    // }
    if (chain?.id !== 114 && chain?.name !== 'Coston2') {
      switchNetwork?.(114)
    }
  }, [chain, switchNetwork])

  return (
    <>
      {/* Badge -- Icon wallet connected */}
      <div className="mt-20 flex justify-center items-center bg-[#334155] h-6 text-white px-auto rounded-full mx-auto">
        <Image
          className="h-4 w-4 mr-2"
          src={isConnected ? Network : X}
          alt="FNS"
        />
        <p className="text-xs font-medium">
          {isConnected ? `${chain?.name} Network` : 'Wallet Not Connected'}
        </p>
      </div>
      {/* Messages */}
      <p className="text-white font-bold text-xl mt-2 text-center">
        {isConnected
          ? 'Your wallet is connected'
          : 'Your wallet is not connected'}
      </p>
      {!isConnected && (
        <p className="text-[#94A3B8] text-[0.625rem] mt-2 text-center">
          Please connect your wallet to register your FNS domain.
        </p>
      )}
      {/* WebConnect Button */}
      <div className="mt-4 mb-12 flex justify-center items-center text-center h-8 rounded-lg text-white px-auto mx-auto">
        <Web3Button icon="hide" label="Connect Wallet +" balance="hide" />
      </div>
    </>
  )
}

function WalletConnect() {
  return (
    <>
      {/* Wallet connect */}
      <div className="hidden lg:flex lg:w-1/4">
        <div className="flex-col justify-center items-center w-full h-80 bg-gray-800 rounded-lg px-1 xl:px-7">
          <WalletConnectSection />
        </div>
      </div>
    </>
  )
}

export default WalletConnect
