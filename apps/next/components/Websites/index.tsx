import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import Check from "../../public/check-circle.png";
import Delete from "../../public/Delete.svg";
import WalletConnect from "../WalletConnect";
// import Link from "next/link";
import { Link } from "react-router-dom";
import AccountWeb from "./AccountWeb";

import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

import { utils } from "ethers";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";

const textKeys: Array<string> = [
  "website.titleText",
  "website.bgPhotoHash",
  "website.body",
  "website.theme",
  "website.button1",
  "website.button1Link",
  "website.contactButton",
  "website.contactButtonEmail",
  "website.name",
  "website.role",
  "website.profilePicture",
  "website.buttonBackgroundColor",
];

import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";

const OwnedDomains = ({
  date,
  domain,
  isSubdomain,
  hasWebsite,
}: {
  date: Date;
  domain: string;
  isSubdomain: boolean;
  hasWebsite: boolean;
}) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // console.log(`This domain ${domain} has a website --> ${hasWebsite}`);
  return (
    <>
      <div className="flex sm:flex-row gap-4 w-full sm:items-center justify-between md:px-6 py-5">
        <div className="inline-flex flex-row items-center">
          {/* Avatar */}
          <Image className="h-8 w-8 mr-2" src={Avatar} alt="Avatar" />
          {/* Domain */}
          <Link to={`../${domain}.flr`}>
            <p
              className={
                "text-white w-[4.5rem] sm:w-full font-semibold text-xs sm:text-base break-all cursor-pointer hover:underline hover:underline-offset-2"
              }
            >
              {domain}.flr
            </p>
          </Link>
          {hasWebsite && (
            <Image className="h-5 w-5 ml-2" src={Check} alt="Check" />
          )}
        </div>
        <div className="flex items-center">
          {hasWebsite && (
            <div className="hidden sm:flex mr-2 px-2.5 py-0.5 bg-orange-500 h-7 rounded-3xl justify-center items-center gap-1.5">
              <p className="text-center text-white text-xs font-medium">
                Published Website
              </p>
            </div>
          )}
          <Link to={`/page_builder/${domain}.flr`}>
            <div className="flex items-center justify-center bg-[#1F2936] border border-slate-200 cursor-pointer rounded-lg px-2 sm:px-3 py-2 md:shrink-0 hover:brightness-150">
              <p className="text-white text-[0.6rem] sm:text-xs font-medium py-1">
                {hasWebsite ? "Edit Website" : "Create Website"}
              </p>
            </div>
          </Link>
          {hasWebsite && (
            <Image
              className="h-5 w-5 ml-2 sm:ml-3 cursor-pointer"
              src={Delete}
              alt="Check"
            />
          )}
        </div>
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
  const [dataDomains, setDataDomains] = useState<
    {
      address?: `0x${string}`;
      abi?: any;
      functionName?: string;
      args?: [any, number];
    }[]
  >([]);
  const [isReady, setIsReady] = useState<boolean>(false);

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
      const dataDomains = arrDomains.map((item: any, index: any) => {
        return {
          address: PublicResolver.address as `0x${string}`,
          abi: PublicResolver.abi,
          functionName: "text",
          args: [utils.namehash(item.label + ".flr"), "website.titleText"],
        };
      });
      // console.log("dataDomains", dataDomains);
      setDataDomains(dataDomains);
      setAddressDomain(ownedDomain);
      setIsReady(true);
    },
    onError(error) {
      console.error("Error getAll", error);
    },
  });

  // // Performs all of the reads for the text record types and
  // // returns an array of strings corresponding to each type.
  const { data: textRecords, refetch: refetchText } = useContractReads({
    contracts: dataDomains as [
      {
        address?: `0x${string}`;
        abi?: any;
        functionName?: string;
        args?: [any, number];
      },
    ],
    enabled: isReady,
    onSuccess(data: any) {
      console.log("Success texts", data);
    },
    onError(error) {
      console.log("Error texts", error);
    },
  });

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
                hasWebsite={textRecords[index] !== ""}
              />
            ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
