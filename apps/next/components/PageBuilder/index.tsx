import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import WalletConnect from "../WalletConnect";
import Link from "next/link";
import HeaderBuilder from "./HeaderBuilder";

import { useAccount } from "wagmi";

// import MintedDomainNames from '../../src/pages/abi/MintedDomainNames.json'

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

export default function PageBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  // const [addressDomain, setAddressDomain] = useState<Array<Domain>>([])

  const { address, isConnected } = useAccount();

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full"
    >
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <HeaderBuilder />

        {/* <div className="flex-col py-4 mb-4 mt-10">
          <p className="text-white font-semibold text-lg mb-2">Owned Domains</p>
          <p className="text-gray-400 font-medium text-sm">
            Manage Your Account Here
          </p>
        </div> */}

        <div className="flex-col bg-gray-800"></div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
