import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import WalletConnect from "../WalletConnect";
import Link from "next/link";
import HeaderBuilder from "./HeaderBuilder";

import { useAccount } from "wagmi";
import WebBuilderForm from "./WebBuilderForm";
import Preview from "./Preview";

import { Step } from "../Register/Steps";

import { Dispatch, SetStateAction } from "react";

const progressArr = [
  {
    number: 1,
    stepText: "Select Domain",
    descriptionText: `Select your domain for website minting below. Once a website is minted, it will be displayed at the selected domain. Website will be viewable on Brave and Opera browsers. More browsers to be added.`,
  },
  {
    number: 2,
    stepText: "Upload Assets",
    descriptionText: `Framework Functionality: Background image must be900x1200 pixels and no bigger than 5MB, title and body text are center aligned, website supports one font at this time, contact button link must include: 'mailto' See FAQ.`,
  },
  {
    number: 3,
    stepText: "Mint Website",
    descriptionText: `Once a website is minted to a domain, it can only be removed by returning to this Site Builder and burning the minted website. If a website is to be updated, it must be burned and re-minted. See FAQ.`,
  },
];

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

  const [countBuilder, setCountBuilder] = useState(0);

  interface UpdateFunctions {
    [key: string]: Dispatch<SetStateAction<any>>;
  }

  const [formState, setFormState] = useState({
    title: "",
    background: "",
    body: "",
    theme: "glassmorphsm",
    button1: "",
    button1Link: "",
    contactButton: "",
    name: "",
    role: "",
    profilePicture: undefined,
    buttonColor: "#F97316",
  });

  const updateFunctions: UpdateFunctions = {
    Title: (value) =>
      setFormState((prevState) => ({ ...prevState, title: value })),
    Body: (value) =>
      setFormState((prevState) => ({ ...prevState, body: value })),
    Background: (value) =>
      setFormState((prevState) => ({ ...prevState, background: value })),
    Theme: (value) =>
      setFormState((prevState) => ({ ...prevState, theme: value })),
    Button1: (value) =>
      setFormState((prevState) => ({ ...prevState, button1: value })),
    Button1Link: (value) =>
      setFormState((prevState) => ({ ...prevState, button1Link: value })),
    ContactButton: (value) =>
      setFormState((prevState) => ({ ...prevState, contactButton: value })),
    Name: (value) =>
      setFormState((prevState) => ({ ...prevState, name: value })),
    Role: (value) =>
      setFormState((prevState) => ({ ...prevState, role: value })),
    ProfilePicture: (value) =>
      setFormState((prevState) => ({ ...prevState, profilePicture: value })),
    ButtonColor: (value) =>
      setFormState((prevState) => ({ ...prevState, buttonColor: value })),
  };

  const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updateFunction = updateFunctions[name];
    if (updateFunction) {
      updateFunction(value);
    }
  };

  const handleBackground = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updateFunction = updateFunctions["Background"];
    if (updateFunction) {
      updateFunction(event);
    }
  };

  const handleProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updateFunction = updateFunctions["ProfilePicture"];
    if (updateFunction) {
      updateFunction(event);
    }
  };

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full"
    >
      <div className="flex-col bg-gray-800 px-4 sm:px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <HeaderBuilder />
        <Preview formState={formState} />
        <WebBuilderForm
          handleInputs={handleInputs}
          handleBackground={handleBackground}
          handleProfile={handleProfile}
        />

        <div className="flex flex-col my-10 w-full lg:flex-row">
          {progressArr.map((item, index) => (
            <Step
              key={index}
              count={countBuilder}
              number={item.number}
              stepText={item.stepText}
              descriptionText={item.descriptionText}
            />
          ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
