import React, { useState } from "react";
import SendFill from "../../public/Send_fill.svg";
import Image from "next/image";

import WalletConnect from "../WalletConnect";
import { useAccount } from "wagmi";
import Form from "./Form";
import Modals from "./Modals";

const HeaderSendTokens = ({
  isConnected,
  address,
}: {
  isConnected: any;
  address: any;
}) => {
  return (
    <div className="flex items-center py-5 border-b border-gray-700">
      <div className="flex-col items-center w-full lg:flex lg:flex-row lg:w-1/2">
        <Image
          className="h-11 w-11 mr-6 mb-4 lg:mb-0"
          src={SendFill}
          alt="Account"
        />
        <div className="flex-col mr-7">
          <p className="text-gray-400 font-normal text-sm">
            {isConnected
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Not Connected"}
          </p>
          <p className="text-white font-bold text-3xl py-2">Send Tokens</p>
          <p className="text-gray-400 font-normal text-sm">
            Send Tokens to a Flare domain
          </p>
        </div>
      </div>
    </div>
  );
};

function SendTokens() {
  const { address, isConnected } = useAccount();
  const [finalTo, setFinalTo] = React.useState("0");
  const [finalAmount, setFinalAmount] = React.useState("0");
  let [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  let [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  return (
    <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <HeaderSendTokens isConnected={isConnected} address={address} />
        {isConnected ? (
          <>
            <Form
              setIsErrorModalOpen={() => setIsErrorModalOpen(true)}
              setIsSuccessModalOpen={() => setIsSuccessModalOpen(true)}
              finalTo={finalTo}
              setFinalTo={setFinalTo}
              finalAmount={finalAmount}
              setFinalAmount={setFinalAmount}
            />
            <Modals
              isSuccessModalOpen={isSuccessModalOpen}
              setIsSuccessModalOpen={() => setIsSuccessModalOpen(false)}
              isErrorModalOpen={isErrorModalOpen}
              setIsErrorModalOpen={() => setIsErrorModalOpen(false)}
              finalTo={finalTo}
              finalAmount={finalAmount}
            />
          </>
        ) : (
          <div className="flex-col py-4 mb-4 mt-10">
            <p className="text-white font-semibold text-lg mb-2">
              Wallet Not Connected
            </p>
            <p className="text-gray-400 font-medium text-sm">
              Connect your wallet to send tokens
            </p>
          </div>
        )}
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}

export default SendTokens;
