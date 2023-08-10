import React, { useState } from "react";
import Image from "next/image";
import PageBuilderImage from "../../public/PageBuilderImage.png";
import Search from "../../public/Search.png";
import styles from "../../src/styles/Main.module.css";
import { useRouter } from "next/router";
import { useAccount, useContractRead } from "wagmi";
import ArrowDown from "../../public/ArrowDown.svg";
import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

const Rev_Record_Line = ({
  text,
  setSelectText,
}: {
  text: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <p
        onClick={() => setSelectText(text)}
        className="py-4 px-3 text-gray-200 font-normal text-sm cursor-pointer hover:bg-gray-500 rounded-lg"
      >
        {text}
      </p>
    </>
  );
};

const Dropdown = ({
  isOpen,
  setIsOpen,
  addressDomain,
  selectText,
  setSelectText,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addressDomain: Array<Domain>;
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex-col cursor-pointer relative w-full md:w-full lg:w-1/2 z-20"
      >
        <div className="flex justify-between items-center p-3 w-full mt-7 bg-gray-700 rounded-lg">
          <p
            className={`text-base font-medium ${
              selectText ? "text-gray-200" : "text-gray-400"
            }`}
          >
            {selectText ? selectText : "Select Your FNS Domain"}
          </p>
          <Image className="h-2 w-3" src={ArrowDown} alt="ArrowDown" />
        </div>
        <div
          className={`${
            isOpen ? "absolute" : "hidden"
          } bg-gray-700 w-full mt-2 rounded-lg`}
        >
          {addressDomain.map((item, index) => (
            <Rev_Record_Line
              key={index}
              text={item.label}
              setSelectText={setSelectText}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default function HeaderBuilder({
  selectText,
  setSelectText,
}: {
  selectText: any;
  setSelectText: any;
}) {
  // const router = useRouter();
  // const [route, setRoute] = useState('')
  // const handleSubmit = (e: any) => {
  //   e.preventDefault()

  //   // Regular expression to validate input
  //   const pattern = /^[a-zA-Z0-9\s\p{Emoji}]+(\.[a-zA-Z0-9\s\p{Emoji}]+)*\.flr$/u

  //   const exception = /^0x[a-fA-F0-9]{40}$/

  //   if (pattern.test(route) || exception.test(route)) {
  //     console.log('Input is valid!')
  //     router.push('register?result=' + route.toLowerCase())
  //   } else {
  //     console.log('Input is invalid!')
  //     const inputElement = e.target.elements['input-field'] as HTMLInputElement
  //     inputElement.setCustomValidity(
  //       'Should be a name with .flr at the end or ethereum address.'
  //     )
  //     inputElement.reportValidity()
  //   }
  // }

  const [isOpen, setIsOpen] = useState(false);
  const [addressDomain, setAddressDomain] = useState<Array<Domain>>([]);

  const { address, isConnected } = useAccount() as any;

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

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center py-5">
        <div className="flex items-center w-full lg:w-1/2">
          <Image
            className="h-11 w-11 mr-6 mb-4 lg:mb-0"
            src={PageBuilderImage}
            alt="Account"
          />
          <div className="flex-col mr-7">
            <p className="text-gray-400 font-normal text-sm">
              {isConnected
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not Connected"}
            </p>
            <p className="text-white font-bold text-3xl py-2">Site Builder</p>
            <p className="text-gray-400 font-normal text-sm">
              Launch your site in just 3 steps.
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <Dropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          addressDomain={addressDomain}
          selectText={selectText}
          setSelectText={setSelectText}
        />
      </div>
    </>
  );
}
