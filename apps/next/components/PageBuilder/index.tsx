import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import WalletConnect from "../WalletConnect";
import Link from "next/link";
import HeaderBuilder from "./HeaderBuilder";

import { useAccount } from "wagmi";
import WebBuilderForm from "./WebBuilderForm";

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

        <WebBuilderForm />

        <div className="flex-col bg-gray-800"></div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
