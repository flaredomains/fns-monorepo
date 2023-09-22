import React, { useEffect, useState } from "react";
import Question from "../../public/Question.svg";
import Plus from "../../public/Plus.svg";
import Image from "next/image";
import SubdomainLine from "./SubdomainLine";
import { Link } from "react-router-dom";

import { ens_normalize_fragment } from "@adraffy/ens-normalize";

import NameWrapper from "../../src/pages/abi/NameWrapper.json";
import PublicResolver from "../../src/pages/abi/PublicResolver.json";

import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

const namehash = require("eth-ens-namehash");

const AddSubdomain = ({
  arrSubdomains,
  checkOwnerDomain,
  filterResult,
  refetchFn,
}: {
  arrSubdomains: Array<any>;
  checkOwnerDomain: boolean;
  filterResult: string;
  refetchFn: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isInputValid, setIsInputValid] = useState<boolean>(false);

  // This effect ensures that subdomains will not contain a "." or any other illegal characters
  // TODO: Add an "illegal character" message underneath the form input when isInputValid is false
  useEffect(() => {
    try {
      if (input.includes(".")) {
        throw Error('disallowed character: "."');
      }

      const result = ens_normalize_fragment(input);
      setIsInputValid(true);
    } catch (error) {
      setIsInputValid(false);
    }
  }, [input]);

  const { address, isConnected } = useAccount();

  const { config: configSetSubnodeRecord } = usePrepareContractWrite({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: "setSubnodeRecord",
    enabled: input !== "",
    args: [
      namehash.hash(filterResult + ".flr"), // bytes32:  parentNode
      input as string, // string:   label
      address as `0x${string}`, // address:  newOwner
      PublicResolver.address as `0x${string}`, // address:  resolver
      0, // uint64:   ttl
      0, // uint32:   fuses
      0, // uint64:   expiry (0 because its a subdomain)
    ],
    onSuccess(data) {
      console.log("Success prepare setSubnodeRecord", data);
    },
    onError(error) {
      console.log("Error prepare setSubnodeRecord", error);
    },
  });

  const { data: dataSetSubnodeRecord, write: setSubnodeRecord } =
    useContractWrite({
      ...configSetSubnodeRecord,
      async onSuccess(data) {},
      onError(error) {
        // console.log('Error setSubnodeRecord', error)
      },
    });

  useWaitForTransaction({
    hash: dataSetSubnodeRecord?.hash,
    onSuccess(data) {
      console.log("Success", data);
      refetchFn();
      // console.log('Success setSubnodeRecord', data)
      setIsOpen(false);
    },
  });

  return (
    <>
      <div
        className={`flex flex-col md:flex-row items-center bg-gray-800 px-8 py-12 gap-4 md:gap-6 w-full ${
          arrSubdomains.length > 0 ? `rounded-b-none` : "rounded-b-lg"
        }`}
      >
        {isOpen ? (
          <>
            <form
              className={`${
                isInputValid ? "border-gray-500" : "border-red-500"
              } flex items-center w-full py-2 px-4 h-12 rounded-md bg-gray-700 border-2`}
            >
              <input
                type="text"
                name="input-field"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.toLowerCase());
                }}
                className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal focus:bg-transparent"
                placeholder="Type in a label for your subdomain"
                required
              />
            </form>
            <div className="flex flex-row items-center justify-center ">
              {/* Cancel */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 border border-gray-400 rounded-lg mr-2 hover:scale-105 transform transition duration-300 ease-out"
              >
                <p className="text-gray-400 text-medium text-xs">Cancel</p>
              </button>

              {/* Save */}
              <button
                onClick={() => setSubnodeRecord?.()}
                disabled={!isInputValid || input === ""}
                type="submit"
                value="Submit"
                className="flex justify-center items-center text-center bg-flarelink px-3 py-2 rounded-lg text-white border border-flarelink hover:scale-105 transform transition duration-300 ease-out lg:ml-auto disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100"
              >
                <p className="text-xs font-medium">Save</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row w-full">
              {/* No subdomains have been added yet */}
              {typeof arrSubdomains !== "undefined" &&
                arrSubdomains.length === 0 && (
                  <div
                    className={`flex w-full ${
                      checkOwnerDomain && isConnected ? `lg:w-3/4` : "lg:w-full"
                    } bg-gray-500 py-3 px-5 rounded-lg`}
                  >
                    <Image
                      className="h-4 w-4 mr-2"
                      src={Question}
                      alt="Question"
                    />
                    <div className="flex-col">
                      <p className="text-gray-200 font-semibold text-sm">
                        No subdomains have been added yet
                      </p>
                    </div>
                  </div>
                )}
              {/* Button */}
              {checkOwnerDomain && isConnected && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex justify-center items-center shrink-0 px-4 text-center bg-flarelink h-11 w-[138px] rounded-lg text-white hover:scale-105 transform transition duration-100 ease-out "
                >
                  <p className="text-xs font-medium mr-2 shrink-0">
                    Add Subdomain
                  </p>
                  <Image className="h-4 w-4" src={Plus} alt="Plus" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default function SubdomainContent({
  arrSubdomains,
  checkOwnerDomain,
  filterResult,
  refetchFn,
}: {
  arrSubdomains: Array<any>;
  checkOwnerDomain: boolean;
  filterResult: string;
  refetchFn: any;
}) {
  return (
    <>
      <AddSubdomain
        arrSubdomains={arrSubdomains}
        checkOwnerDomain={checkOwnerDomain}
        filterResult={filterResult}
        refetchFn={refetchFn}
      />

      {arrSubdomains.length > 0 && (
        <div className="flex-col bg-gray-800 px-8 py-5 rounded-b-lg">
          {arrSubdomains.map((item) => (
            <Link key={item.domain} to={`/details/${item.domain}`}>
              <SubdomainLine
                key={item.domain}
                domain={item.domain}
                owner={item.owner}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
