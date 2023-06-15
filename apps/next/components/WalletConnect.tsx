import React, { useEffect } from 'react'
import X from '../public/X.svg'
import Network from '../public/Network.svg'
import Image from 'next/image'
import { Web3Button } from '@web3modal/react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

const WalletConnectSection = () => {
  const { isConnected } = useAccount() as any
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    if (chain?.id !== 14 && chain?.name !== 'Flare') {
      switchNetwork?.(14)
    }
    // if (chain?.id !== 114 && chain?.name !== 'Coston2') {
    //   switchNetwork?.(114)
    // }
  }, [chain, switchNetwork])

  return (
    <>
      {/* Badge -- Icon wallet connected */}
      <div className="flex justify-center items-center bg-[#334155] h-6 text-white px-2 mx-2 rounded-full shrink-0">
        <Image
          className="h-4 w-4 mr-2"
          src={isConnected ? Network : X}
          alt={isConnected ? 'Network' : 'X'}
        />
        <p className="text-xs font-medium shrink-0">
          {isConnected ? `${chain?.name} Network` : 'Wallet Not Connected'}
        </p>
      </div>
      {/* Messages */}
      <p className="text-white font-bold text-xl mt-2 mx-2 text-center">
        {isConnected
          ? 'Your wallet is connected'
          : 'Your wallet is not connected'}
      </p>
      {!isConnected && (
        <p className="text-[#94A3B8] text-[0.625rem] mt-2 mx-2 text-center">
          Please connect your wallet to register your FNS domain.
        </p>
      )}
      {/* WebConnect Button */}
      <div className="mt-2 flex justify-center items-center text-center rounded-lg text-white px-auto mx-auto">
        <Web3Button icon="hide" label="Connect Wallet +" balance="hide" />
      </div>
    </>
  )
}

function WalletConnect() {
  return (
    <>
      {/* Wallet connect */}
      <div
        data-test="WalletConnect"
        className="flex flex-col w-full lg:w-1/4 h-52 lg:h-80 justify-center items-center mt-9 lg:mt-0 px-1 xl:px-7 bg-gray-800 rounded-lg shrink-0"
      >
        <WalletConnectSection />
      </div>
    </>
  )
}

export default WalletConnect
