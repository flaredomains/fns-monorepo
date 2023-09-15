import React, { useState, Fragment, useEffect } from "react";
import SendWhite from "../../public/Send_white.png";
import Image from "next/image";
import styles from "../../src/styles/Main.module.css";

import FlareLogo from "../../public/FlareLogo.png";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useAccount,
  useBalance,
  useContractRead,
} from "wagmi";
import { BigNumber, utils } from "ethers";
import { parseEther } from "viem";
import NameWrapper from "../../src/pages/abi/NameWrapper.json";

const ZERO_ADDRESS: string = "0x0000000000000000000000000000000000000000";

const GetBalance = ({ finalAmount }: { finalAmount: any }) => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  const [truncatedFormatted, setTruncatedFormatted] = React.useState("");

  useEffect(() => {
    if (parseFloat(data?.formatted ? data?.formatted : "0") > 0) {
      setTruncatedFormatted(
        data?.formatted
          ? data.formatted.split(".")[0] +
              "." +
              data.formatted.split(".")[1].slice(0, 4)
          : ""
      );
    } else {
      setTruncatedFormatted("0");
    }
  }, []);

  if (isLoading)
    return (
      <div className="flex w-full justify-center mb-6 text-slate-400">
        Fetching balance…
      </div>
    );
  if (isError)
    return (
      <div className="flex w-full justify-center mb-6 text-slate-400">
        Error fetching balance
      </div>
    );
  return (
    <div className="flex w-full justify-center mb-6 text-slate-400">
      Your Balance: {truncatedFormatted}
      {parseFloat(truncatedFormatted) === 0 ? "" : "..."} {data?.symbol}
    </div>
  );
};

function Form({
  setIsSuccessModalOpen,
  setIsErrorModalOpen,
  finalTo,
  setFinalTo,
  finalAmount,
  setFinalAmount,
}: {
  setIsSuccessModalOpen: any;
  setIsErrorModalOpen: any;
  finalTo: any;
  setFinalTo: any;
  finalAmount: any;
  setFinalAmount: any;
}) {
  const [receiver, setReceiver] = React.useState("");
  const [to, setTo] = React.useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState("");
  const [controlledAmount, setControlledAmount] = React.useState("0");
  const [debouncedAmount] = useDebounce(controlledAmount, 500);

  const [hash, setHash] = useState<string>("");
  const [inputUsable, setInputUsable] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>();

  const domainPattern = /^[a-zA-Z0-9-_$]+\.flr$/;
  const amountPattern = /^[0-9]+(\.[0-9]+)?$/;

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    onSuccess(data) {
      console.log("Success prepare SendTransaction", data);
    },
    onError(error) {
      console.log("Error prepare SendTransaction", error);
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setReceiver("");
      setAmount("");
      setIsSuccessModalOpen(true);
    } else if (isError) {
      setIsErrorModalOpen(true);
    }
  }, [isSuccess, isError]);

  const handleReceiverInput = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    const inputValue = e.target.value as string;
    setReceiver(inputValue);
    // Check if the input value matches the desired pattern: at least one letter followed by ".flr"
    const isFlrInput = domainPattern.test(inputValue);

    if (isFlrInput) {
      setHash(utils.namehash(inputValue));
    }

    setInputUsable(isFlrInput);
  };

  const handleAmountInput = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    const inputValue = e.target.value as string;

    // Check if the input is a valid number
    if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
      setControlledAmount(inputValue);
      setAmount(inputValue);
    } else {
      setAmount("");
    }
  };

  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: "ownerOf",
    enabled: inputUsable,
    args: [hash],
    onSuccess(data: string) {
      setIsValid(data !== ZERO_ADDRESS);
      if (data !== ZERO_ADDRESS) {
        setTo(data);
      }
    },
    onError(error) {
      console.log("Error ownerOf", error);
    },
  });
  return (
    <div className="flex flex-col items-center py-4 mb-4 mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFinalTo(to);
          setFinalAmount(amount);
          sendTransaction?.();
        }}
        className="flex flex-col w-full justify-center"
      >
        <div
          className={`flex items-center mx-auto w-3/4 py-2 px-4 mb-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${
            styles.autofill
          } ${
            isValid === true
              ? "border-green-500"
              : isValid === false && "border-red-500"
          }`}
        >
          <Image className="z-10 h-6 w-6 mr-2" src={FlareLogo} alt="Search" />
          <input
            type="text"
            name="receiver-name"
            onChange={handleReceiverInput}
            onInput={(event) => {
              const inputElement = event.target as HTMLInputElement;
              inputElement.value === ""
                ? (inputElement.setCustomValidity(""), setIsValid(undefined))
                : !domainPattern.test(inputElement.value)
                ? (inputElement.setCustomValidity(
                    "Should be a name with .flr at the end or flare wallet address."
                  ),
                  setIsValid(false))
                : inputElement.setCustomValidity("");
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
            placeholder="Enter the receiver's domain name"
            spellCheck="false"
            required
            value={receiver}
          />
        </div>
        <div className="flex w-full justify-center text-slate-400 ">
          {isValid === true ? (
            <p className="mb-4">Address: {receiver}</p>
          ) : (
            isValid === false && (
              <p className="mb-4">
                The input is not a valid domain name or doesn&apos;t exist
              </p>
            )
          )}
        </div>
        <div
          className={`flex items-center mx-auto w-1/2 py-2 px-4 h-12 mb-2 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
        >
          <input
            type="text"
            name="token-value"
            onChange={handleAmountInput}
            onInput={(event) => {
              const inputElement = event.target as HTMLInputElement;
              inputElement.value === ""
                ? inputElement.setCustomValidity("")
                : !amountPattern.test(inputElement.value)
                ? inputElement.setCustomValidity(
                    "Please enter a decimal number using a period as the decimal separator."
                  )
                : inputElement.setCustomValidity("");
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
            placeholder="0.123"
            spellCheck="false"
            required
            value={amount}
          />
        </div>
        <GetBalance finalAmount={finalAmount} />
        <button
          disabled={
            (isValid && parseFloat(amount) === 0) ||
            amount === "" ||
            isLoading ||
            !sendTransaction
          }
          className="flex w-48 mx-auto justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <p className="text-base font-semibold mr-1">
            {isLoading ? "Sending..." : "Send Tokens"}
          </p>
          <Image className="h-6 w-6" src={SendWhite} alt="Send" />
        </button>
      </form>
      {isSuccess && (
        <div className="flex flex-col w-full justify-center items-center px-2 mt-8 gap-3 text-white">
          <p className="flex flex-col text-center px-2 break-words">
            Successfully sent {finalAmount} Flare to{" "}
            <span className="break-all italic">{finalTo}</span>
          </p>
          <div>
            <a
              href={`https://flare-explorer.flare.network/tx/${data?.hash}`}
              // href={`https://coston2-explorer.flare.network/tx/${data?.hash}`}
              className="flex mt-2 py-1 px-4 rounded-xl bg-[#F97316] hover:scale-105 transform transition duration-300 ease-out"
            >
              Flare Explorer
            </a>
          </div>
          <p className="flex flex-col text-center px-2 break-words">
            Transaction Hash:
            <span className="break-all italic font-semibold">{data?.hash}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Form;
