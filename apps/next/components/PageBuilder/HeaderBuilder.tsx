import React, { useState } from "react";
import Image from "next/image";
import PageBuilderImage from "../../public/PageBuilderImage.png";
import Search from "../../public/Search.png";
import styles from "../../src/styles/Main.module.css";
import { useRouter } from "next/router";
import { useAccount, useContractRead } from "wagmi";
import ArrowDown from "../../public/ArrowDown.svg";
import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";
import { Combobox } from "@headlessui/react";
import Avatar from "../../public/Avatar.svg";

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Dropdown = ({
  addressDomain,
  selectText,
  setSelectText,
  setCountBuilder,
}: {
  addressDomain: Array<Domain>;
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
  setCountBuilder: any;
}) => {
  const [query, setQuery] = useState("");

  const filteredDomain =
    query === ""
      ? addressDomain
      : addressDomain.filter((domain: Domain) => {
          return domain.label.toLowerCase().includes(query.toLowerCase());
        });

  const handleSelect = (domain: any) => {
    setSelectText(domain.label);
  };
  return (
    <>
      <Combobox
        as="div"
        value={selectText}
        onChange={(event) => handleSelect(event)}
        className="w-full lg:w-2/3 xl:w-1/2"
      >
        <div className="w-full relative mt-2">
          <Combobox.Input
            className="w-full h-12 rounded-md border-0 bg-gray-700 py-1.5 pl-3 pr-12 text-gray-400 shadow-sm focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={() => selectText}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <Image className="h-2 w-3" src={ArrowDown} alt="ArrowDown" />
          </Combobox.Button>

          {filteredDomain.length > 0 && (
            <Combobox.Options className="absolute z-10 max-h-56 overflow-auto bg-gray-700 w-full mt-2 rounded-lg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredDomain.map((domain: Domain, index: number) => (
                <Combobox.Option
                  key={index}
                  value={domain}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-gray-500 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center py-4 px-3 text-gray-200 font-normal text-sm cursor-pointer">
                        <Image
                          src={Avatar}
                          alt=""
                          className="h-6 w-6 flex-shrink-0 rounded-full"
                        />
                        <span
                          className={classNames(
                            "ml-3 truncate",
                            selected && "font-semibold"
                          )}
                        >
                          {domain.label}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : ""
                          )}
                        ></span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </>
  );
};

export default function HeaderBuilder({
  selectText,
  setSelectText,
  setCountBuilder,
}: {
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
  setCountBuilder: any;
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
      <div className="flex flex-col lg:flex-row items-center py-5 w-full gap-4">
        <div className="flex items-center w-full lg:w-2/3">
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
          addressDomain={addressDomain}
          selectText={selectText}
          setSelectText={setSelectText}
          setCountBuilder={setCountBuilder}
        />
      </div>
    </>
  );
}
