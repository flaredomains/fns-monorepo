import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import WalletConnect from "../WalletConnect";
import Link from "next/link";
import AccountWeb from "./AccountWeb";

import { useAccount, useContractRead } from "wagmi";

import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";

const OwnedDomains = ({
  date,
  domain,
  isSubdomain,
}: {
  date: Date;
  domain: string;
  isSubdomain: boolean;
}) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:items-center justify-between md:px-6 py-5">
        <div className="inline-flex flex-row items-center">
          {/* Avatar */}
          <Image className="h-8 w-8 mr-2" src={Avatar} alt="Avatar" />

          {/* Domain */}
          <Link
            href={{
              pathname: domain + ".flr",
            }}
            title={`${domain}.flr`}
          >
            <p
              className={
                "text-white font-semibold text-base break-all cursor-pointer hover:underline hover:underline-offset-2"
              }
            >
              {domain}.flr
            </p>
          </Link>
        </div>
        {/* Date exp */}
        <Link
          href={{
            pathname: "page_builder",
            query: { result: domain + ".flr" },
          }}
        >
          <div className="flex items-center justify-center bg-[#1F2936] border border-slate-200 cursor-pointer rounded-lg px-3 py-2 md:shrink-0 hover:brightness-150">
            <p className="text-white text-xs font-medium py-1">
              Create Website
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

export default function MyAccountWebsites() {
  const [isOpen, setIsOpen] = useState(false);
  const [addressDomain, setAddressDomain] = useState<Array<Domain>>([]);

  const { address, isConnected } = useAccount();

  const { data } = useContractRead({
    address: MintedDomainNames.address as `0x${string}`,
    abi: MintedDomainNames.abi,
    functionName: "getAll",
    enabled: isConnected,
    args: [address],
    onSuccess(data: any) {
      // console.log('Success getAll', data)
      // console.log('Get array of domains', data)

      // Ensure we only use the length returned for still-owned domains (after a transfer)
      const arrDomains = data.data.slice(0, data._length.toNumber());
      const ownedDomain = arrDomains.map((item: any, index: any) => {
        return {
          label: item.label,
          expire: Number(item.expiry),
          isSubdomain: /[a-zA-Z0-9]+\.{1}[a-zA-Z0-9]+/.test(item.label),
        };
      });
      setAddressDomain(ownedDomain);
    },
    onError(error) {
      console.error("Error getAll", error);
    },
  });

  console.log("addressDomain", addressDomain);

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full"
    >
      <div className="flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <AccountWeb />

        <div className="flex-col py-4 mb-4 mt-10">
          <p className="text-white font-semibold text-lg mb-2">
            Owned Domains / Websites
          </p>
          <p className="text-gray-400 font-medium text-sm">
            Manage Your Websites Here
          </p>
        </div>

        <div className="flex-col bg-gray-800">
          {isConnected &&
            addressDomain.map((item, index) => (
              <OwnedDomains
                key={index}
                date={new Date(item.expire ? item.expire * 1000 : "")}
                domain={item.label}
                isSubdomain={item.isSubdomain}
              />
            ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
