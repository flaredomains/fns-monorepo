import React, { useState } from "react";
import Image from "next/image";
import MyAccount from "../../public/MyAccount.svg";
import Search from "../../public/Search.svg";
import styles from "../../src/styles/Main.module.css";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function AccountWeb() {
  const { address, isConnected } = useAccount() as any;

  const [route, setRoute] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Regular expression to validate input
    const pattern =
      /^[a-zA-Z0-9\s\p{Emoji}]+(\.[a-zA-Z0-9\s\p{Emoji}]+)*\.flr$/u;

    const exception = /^0x[a-fA-F0-9]{40}$/;

    if (pattern.test(route) || exception.test(route)) {
      console.log("Input is valid!");
      navigate("../register/" + route.toLowerCase());
    } else {
      console.log("Input is invalid!");
      const inputElement = e.target.elements["input-field"] as HTMLInputElement;
      inputElement.setCustomValidity(
        "Should be a name with .flr at the end or ethereum address."
      );
      inputElement.reportValidity();
    }
  };
  return (
    <>
      <div className="flex items-center py-5 border-b border-gray-700">
        <div className="flex-col items-center w-full lg:flex lg:flex-row lg:w-1/2">
          <Image
            className="h-11 w-11 mr-6 mb-4 lg:mb-0"
            src={MyAccount}
            alt="Account"
          />
          <div className="flex-col mr-7">
            <p className="text-gray-400 font-normal text-sm">
              {isConnected
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not Connected"}
            </p>
            <p className="text-white font-bold text-3xl py-2">My Websites</p>
            <p className="text-gray-400 font-normal text-sm">
              Manage Your Websites Here
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`hidden lg:flex items-center w-1/2 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
        >
          <Image className="z-10 h-6 w-6 mr-2" src={Search} alt="Search" />
          <input
            type="text"
            name="input-field"
            value={route}
            onChange={(e) => {
              setRoute(e.target.value.toLowerCase());
            }}
            onInput={(event) => {
              const inputElement = event.target as HTMLInputElement;
              inputElement.setCustomValidity("");
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
            placeholder="Search New Names or Addresses"
            spellCheck="false"
            required
          />
        </form>
      </div>
    </>
  );
}
