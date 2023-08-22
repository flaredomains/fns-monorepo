import React, { useState, useEffect } from "react";
import Image from "next/image";
import ArrowDown from "../../public/ArrowDown.svg";
import { Combobox } from "@headlessui/react";
import Avatar from "../../public/Avatar.svg";

import ReverseRegistrar from "../../src/pages/abi/ReverseRegistrar.json";
import PublicRegistrar from "../../src/pages/abi/PublicResolver.json";

const namehash = require("eth-ens-namehash");

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Dropdown = ({
  addressDomain,
  selectText,
  setSelectText,
}: {
  addressDomain: Array<Domain>;
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
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
      >
        <div className="w-full md:w-1/2 relative mt-2">
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
              {filteredDomain.map((domain: Domain, index) => (
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

type Domain = {
  label: string;
  expire: number;
};

export default function Reverse_Record({
  addressDomain,
}: {
  addressDomain: Array<Domain>;
}) {
  const [isLarge, setisLarge] = useState(false);
  const [selectText, setSelectText] = useState<string>("");
  const [writeFuncHash, setWriteFuncHash] = useState("");

  const { address, isConnected } = useAccount();

  useEffect(() => {
    // First render
    if (window.innerWidth >= 1024) {
      setisLarge(window.innerWidth >= 1024);
    }

    const handleResize = () => {
      setisLarge(window.innerWidth >= 1024);
    };

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: node, isFetched } = useContractRead({
    address: ReverseRegistrar.address as `0x${string}`,
    abi: ReverseRegistrar.abi,
    functionName: "node",
    args: [address],
    onSuccess(data: any) {
      console.log("Success node: ", data);
    },
    onError(error) {
      console.log("Error node", error);
    },
  });

  // NameResolver Name
  const { data: mainDomain, refetch: refetchMainDomain } = useContractRead({
    address: PublicRegistrar.address as `0x${string}`,
    abi: PublicRegistrar.abi,
    functionName: "name",
    enabled: isConnected && isFetched,
    args: [node],
    onSuccess(data: any) {
      console.log("Success name: ", data);
    },
    onError(error) {
      console.log("Error name", error);
    },
  });

  //  SetName Prepare selectText + '.flr'
  const { config: prepareSetName } = usePrepareContractWrite({
    address: ReverseRegistrar.address as `0x${string}`,
    abi: ReverseRegistrar.abi,
    functionName: "setName",
    args: [selectText],
    enabled: isConnected && selectText !== "",
    onSuccess(data: any) {
      console.log("Success prepareSetName", data);
      // setPrepared(true)
    },
    onError(error) {
      console.log("Error prepareSetName", error);
    },
  });

  console.log("selectText", selectText);

  // SetName Write Func
  const { write: setName, isSuccess } = useContractWrite({
    ...prepareSetName,
    onSuccess(data) {
      console.log("Success setName", data);
      setWriteFuncHash(data.hash);
    },
  }) as any;

  const { data } = useWaitForTransaction({
    hash: writeFuncHash as `0x${string}`,
    enabled: isSuccess && writeFuncHash,
    onSuccess(data) {
      console.log("Success setName block", data);
      refetchMainDomain();
    },
  });
  return (
    <>
      <div className="flex justify-between mt-16 gap-2">
        {/* Text */}
        <p className="text-white font-semibold text-lg">
          {isLarge ? "Primary FNS Name (Reverse Record)" : "Primary FNS Name"}
          {mainDomain ? ` : ${mainDomain}.flr` : ""}
        </p>
        {/* Button */}
        <div
          onClick={() => setName?.()}
          className="flex items-center h-7 px-3 py-1 bg-[#F97316] rounded-full cursor-pointer hover:scale-110 active:scale-125 transform transition duration-300 ease-out lg:py-2 lg:px-4 shrink-0"
        >
          <p className="text-white text-sm font-medium">Set Name</p>
        </div>
      </div>

      {/* Text */}
      <p className="mt-2 w-full font-normal text-sm text-gray-400 lg:w-3/5">
        This sets one of your FNS names to represent your Flare account and
        becomes your Web3 username and profile. You may only use one per account
        and can change it at any time.
      </p>

      {/* Dropdown */}
      <Dropdown
        addressDomain={addressDomain}
        selectText={selectText}
        setSelectText={setSelectText}
      />

      {/* Text */}
      <p className="mt-2 w-full font-normal text-sm text-gray-400 lg:w-1/2">
        Only FNS Domains you own can be used here
      </p>
    </>
  );
}
