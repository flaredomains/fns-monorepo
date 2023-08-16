import React, { useState, useEffect } from "react";
import Like from "../../public/Like.svg";
import Dislike from "../../public/Dislike.svg";
import WalletConnect from "../WalletConnect";
import Image from "next/image";
import DomainSelect from "../DomainSelect";
import Selector from "./Selector";
import FinalPrice from "./FinalPrice";
import Steps from "./Steps";
import Bottom from "./Bottom";
import web3 from "web3-utils";

import { useRouter } from "next/router";

import FLRRegistrarController from "../../src/pages/abi/FLRRegistrarController.json";

import { useFeeData, useContractRead } from "wagmi";

export enum RegisterState {
  Uncommitted, // this is the default begin state (count => 0)
  Committable, // reflects if commit will succeed or not (if there's a valid commitment already or not)
  Committing, // committing transaction in progress
  Waiting, // committing transaction complete, waiting timer in progress (count => 1)
  Unregistered, // timer complete, pending register transaction (count => 2)
  Registering, // registering transaction in progress
  Registered, // registration complete (count => 3)
}

const Alert = ({
  available,
  registerState,
}: {
  available: boolean;
  registerState: RegisterState | undefined;
}) => {
  return (
    <>
      <div className="flex w-full bg-[#F97316] py-3 px-5 rounded-lg">
        {registerState !== undefined ? (
          <>
            <Image
              className={`h-4 w-4 mr-2 ${!available && "mt-1"}`}
              src={available ? Like : Dislike}
              alt={available ? "Like" : "Dislike"}
            />
            <div className="flex-col">
              <p className="text-white font-semibold text-sm">
                {available
                  ? "This name is available!"
                  : "This name is already registered."}
              </p>
              <p className="text-white font-normal text-sm mt-2">
                {available
                  ? "Please complete the form below to secure this domain for yourself."
                  : "Please check the Details tab to see when this domain will free up."}
              </p>
            </div>
          </>
        ) : (
          <div className="grid items-center w-full h-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-orange-300 h-4 w-4"></div>
              <div className="flex-1 space-y-6 py-1 grid grid-cols-5">
                <div className="h-2 bg-orange-300 rounded col-span-2"></div>
                <div className="h-2 bg-orange-300 rounded col-span-4"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const StepTitle = () => {
  return (
    <>
      <div className="hidden items-center mt-12 lg:flex">
        <div className="bg-[#F97316] h-8 w-8 rounded-full mr-4" />
        <p className="text-white font-semibold text-lg">
          Registering requires 3 steps
        </p>
      </div>
    </>
  );
};

export default function Register({ result }: { result: string }) {
  // For steps animation
  const [count, setCount] = useState(0);

  // State variable that changed inside useEffect that check result and unlock Wagmi READ/WRITE function
  const [filterResult, setFilterResult] = useState<string>("");
  const [hashHex, setHashHex] = useState<string>("");
  const [preparedHash, setPreparedHash] = useState<boolean>(false);
  const [isNormalDomain, setIsNormalDomain] = useState<boolean>(true);

  // State variable that changed inside Wagmi hooks
  const [regPeriod, setRegPeriod] = useState(1);
  const [priceFLR, setPriceFLR] = useState("1");

  const [registerState, setRegisterState] = useState<
    RegisterState | undefined
  >();

  // Used for useEffect for avoid re-render
  const router = useRouter();

  function getParentDomain(str: string) {
    // Define a regular expression pattern that matches subdomains of a domain that ends with .flr.
    const subdomainPattern = /^([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{1,}\.flr$/i;

    // Use the regular expression pattern to test whether the string matches a subdomain.
    const isSubdomain = subdomainPattern.test(str);
    // console.log('isSubdomain', isSubdomain)

    if (isSubdomain) {
      // The input string is a subdomain, extract the parent domain.
      const parts = str.split(".");
      const numParts = parts.length;
      const parentDomain = parts.slice(numParts - (numParts - 1)).join(".");
      setIsNormalDomain(false);
      return parentDomain;
    } else {
      return str;
    }
  }

  useEffect(() => {
    if (!router.isReady) return;

    const result = router.query.result as string;

    const parent = getParentDomain(result);

    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log("Ethereum address");
      setFilterResult(result);
    } else if (result) {
      // Remove .flr from result for READ/WRITE function purposes and get hash
      const resultFiltered = result.endsWith(".flr")
        ? result.slice(0, -4)
        : result;
      const hash = web3.sha3(resultFiltered) as string;
      setFilterResult(resultFiltered);
      setHashHex(hash);
      setPreparedHash(true);
    }
  }, [router.isReady, router.query]);

  // Available READ function
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: "available",
    enabled: preparedHash,
    args: [filterResult],
    onSuccess(data: any) {
      // data is a boolean that represents if the domain is available or not
      if (data) {
        setRegisterState(RegisterState.Uncommitted);
      } else {
        setRegisterState(RegisterState.Registered);
      }
    },
    onError(error) {
      console.log("Error available", error);
    },
  });

  // RentPrice READ function
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: "rentPrice",
    args: [filterResult as string, 31556952], // 31536000
    onSuccess(data: any) {
      setPriceFLR(data.base);
    },
    onError(error) {
      console.log("Error rentPrice", error);
    },
  });

  const { data: fee } = useFeeData();

  const incrementYears = () => {
    if (regPeriod >= 999) return;
    setRegPeriod(regPeriod + 1);
  };

  const decreaseYears = () => {
    if (regPeriod === 1) return;
    if (regPeriod < 1) {
      setRegPeriod(1);
    }
    setRegPeriod(regPeriod - 1);
  };

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <DomainSelect result={result} />

          <div className="flex-col bg-gray-800 px-8 py-12 rounded-b-lg">
            <Alert
              available={
                isNormalDomain &&
                registerState !== RegisterState.Registered &&
                registerState !== undefined
              }
              registerState={registerState}
            />
            {isNormalDomain &&
              registerState !== RegisterState.Registered &&
              registerState !== undefined && (
                <>
                  {/* Increment Selector */}
                  <Selector
                    regPeriod={regPeriod}
                    priceToPay={priceFLR}
                    incrementYears={incrementYears}
                    decreaseYears={decreaseYears}
                  />

                  {/* Final price block */}
                  <FinalPrice
                    regPeriod={regPeriod}
                    fee={Number(fee?.gasPrice)}
                    priceToPay={priceFLR}
                  />

                  {/* Steps title mobile hidden */}
                  <StepTitle />

                  {/* Steps */}
                  <Steps count={count} />

                  <Bottom
                    result={filterResult}
                    regPeriod={regPeriod}
                    price={priceFLR}
                    count={count}
                    setCount={setCount}
                    registerState={registerState}
                    setRegisterState={setRegisterState}
                  />
                </>
              )}
          </div>
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  );
}
