import React, { useEffect, useState } from "react";
import WalletConnect from "../WalletConnect";
import HeaderBuilder from "./HeaderBuilder";
import WebBuilderForm from "./WebBuilderForm";
import Preview from "./Preview";
import { Step } from "../Register/Steps";
import { useLocation } from "react-router-dom";
import {namehash} from "viem/ens";
import { keccak256 } from "js-sha3";

import { progressArr } from "../../lib/progressTexts";
import { textKeys } from "../../lib/testkeys";
import { getImage, uploadImageCloudflare } from "../../lib/clientS3";
import usePrepareMulticall from "./prepareMulticall";

// For READ / WRITE call smart contract
import {
  useAccount,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

export default function PageBuilder({
  setOpen,
  selectText,
  setSelectText,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectText: string;
  setSelectText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const location = useLocation();

  const [oldUUIDAvatar, setoldUUIDAvatar] = useState("");
  const [oldUUIDWebsite, setoldUUIDWebsite] = useState("");

  const { isConnected } = useAccount();

  // React Hooks
  const [countBuilder, setCountBuilder] = useState(0);
  const [ownedDomain, setOwnedDomain] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false); // State variable for disable mint button IF is not owner of the domain
  const [loading, setLoading] = useState<boolean>(false); // For spinner on mint button

  // Check prepareMulticall.ts for more details
  const {
    formState,
    nameHash,
    keccakImageWebsite,
    keccakImageAvatar,
    prepareMulticallArgs,
    updateFunctions,
    setNameHash,
    setKeccakImageWebsite,
    setKeccakImageAvatar,
    resetValue,
  } = usePrepareMulticall({
    title: "",
    background: "",
    body: "",
    theme: "glassmorphism",
    button1: "",
    button1Link: "",
    contactButton: "",
    contactButtonEmail: "",
    name: "",
    role: "",
    profilePicture: "",
    buttonBackgroundColor: "#FFFFFF",
  });

  useEffect(() => {
    // Check if there are any undefined values in formState
    const hasUndefinedValues = Object.values(formState).some(
      (value) => value === ""
    );

    // Update countBuilder based on the condition
    if (!hasUndefinedValues && countBuilder === 1) {
      setCountBuilder(2);
    }
  }, [formState, countBuilder]);

  useEffect(() => {
    if (!location) return;
    const lastIndex = location.pathname.lastIndexOf("/");

    const result = location.pathname.substring(lastIndex + 1) as string;
    const resultFiltered = result.endsWith(".flr")
      ? result.slice(0, -4)
      : result;

    setSelectText(resultFiltered);
  }, [location]);

  useEffect(() => {
    if (ownedDomain) {
      setIsOwner(ownedDomain.includes(selectText));
    }
    if (selectText) {
      setNameHash(namehash(selectText + ".flr"));
      setCountBuilder(1);
    }
    if (formState.background) {
      setKeccakImageWebsite(keccak256(formState.background));
    }
    if (formState.profilePicture) {
      setKeccakImageAvatar(keccak256(formState.profilePicture));
    }
  }, [selectText, ownedDomain, formState.background, formState.profilePicture]);

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
    const target = event;
    // console.log("target", target);
    const updateFunction = updateFunctions["ProfilePicture"];
    if (updateFunction) {
      updateFunction(event);
    }
  };

  const handleBackgroundColor = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updateFunction = updateFunctions["ButtonBackgroundColor"];
    if (updateFunction) {
      updateFunction(event);
    }
  };

  // "website.titleText",
  // "website.bgPhotoHash",
  // "website.body",
  // "website.theme",
  // "website.button1",
  // "website.button1Link",
  // "website.contactButton",
  // "website.contactButtonEmail",
  // "website.name",
  // "website.role",
  // "website.profilePicture",
  // "website.buttonBackgroundColor",

  const { config: testMulticall } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "multicall",
    args: [
      [
        prepareMulticallArgs.prepareSetTitle,
        prepareMulticallArgs.prepareSetBgPhotoHash,
        prepareMulticallArgs.prepareSetBody,
        prepareMulticallArgs.prepareTheme,
        prepareMulticallArgs.prepareButton1,
        prepareMulticallArgs.prepareButton1Link,
        prepareMulticallArgs.prepareContactButton,
        prepareMulticallArgs.prepareContactButtonEmail,
        prepareMulticallArgs.prepareName,
        prepareMulticallArgs.prepareRole,
        prepareMulticallArgs.prepareProfilePicture,
        prepareMulticallArgs.prepareButtonBackgroundColor,
      ],
    ],
    enabled:
      formState.title !== "" &&
      formState.body !== "" &&
      formState.button1 !== "" &&
      formState.button1Link !== "" &&
      formState.contactButton !== "" &&
      formState.contactButtonEmail !== "" &&
      formState.name !== "" &&
      formState.role !== "" &&
      prepareMulticallArgs.prepareSetTitle !== "" &&
      prepareMulticallArgs.prepareSetBgPhotoHash !== "" &&
      prepareMulticallArgs.prepareSetBody !== "" &&
      prepareMulticallArgs.prepareButton1 !== "" &&
      prepareMulticallArgs.prepareButton1Link !== "" &&
      prepareMulticallArgs.prepareContactButton !== "" &&
      prepareMulticallArgs.prepareContactButtonEmail !== "" &&
      prepareMulticallArgs.prepareName !== "" &&
      prepareMulticallArgs.prepareRole !== "" &&
      prepareMulticallArgs.prepareProfilePicture !== "",
    onSuccess(data: any) {
      console.log("Success multicall", data);
      setIsReady(true);
    },
    onError(error) {
      console.log("Error prepareSetMulticall", error);
      setIsReady(false);
    },
  });

  const { data: multicallData, write: writeMulticall } = useContractWrite({
    ...testMulticall,
    async onSuccess(data) {
      console.log("Success writeMulticall", data);

      // Website
      await uploadImageCloudflare(
        keccakImageWebsite,
        selectText + ".flr",
        formState.background,
        "imageWebsite",
        oldUUIDWebsite
      ).catch((err) => {
        setLoading(false);
        console.log("Error on uploading image website", err);
      });

      // Avatar
      await uploadImageCloudflare(
        keccakImageAvatar,
        selectText + ".flr",
        formState.profilePicture,
        "imageAvatar",
        oldUUIDAvatar
      ).catch((err) => {
        setLoading(false);
        console.log("Error on uploading image website", err);
      });
    },
    onError(data) {
      setLoading(false);
      setIsReady(false);
    },
  }) as any;

  useWaitForTransaction({
    hash: multicallData?.hash,
    onSuccess(data) {
      console.log("Success multicallData", data);
      // Reset fields
      resetValue();

      setLoading(false);
      setOpen(true);
      setIsReady(false);
    },
  });

  // Prepares an array of read objects on the PublicResolver contract
  // for every available text record type defined in `addressKeys`.
  const textRecordReads = textKeys.map((item) => ({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "text",
    args: [nameHash, item],
  }));

  // Performs all of the reads for the text record types and
  // returns an array of strings corresponding to each type.
  const { data: textRecords, refetch: refetchText } = useContractReads({
    contracts: textRecordReads as [
      {
        address?: `0x${string}`;
        abi?: any;
        functionName?: string;
        args?: [any, number];
      },
    ],
    enabled: nameHash !== "",
    async onSuccess(data: any) {
      console.log("Success texts", data);
      resetValue();
      setIsReady(false);
      if (data[0]) {
        const dataTexts = data.map((obj: any) => obj.result);
        const imageKeccakWebsite = dataTexts[1];
        const imageKeccakAvatar = dataTexts[10];
        setoldUUIDWebsite(imageKeccakWebsite);
        setoldUUIDAvatar(imageKeccakAvatar);

        updateFunctions["Title"](dataTexts[0]);
        updateFunctions["Body"](dataTexts[2]);
        updateFunctions["Theme"](dataTexts[3] || "glassmorphism");
        updateFunctions["Button1"](dataTexts[4]);
        updateFunctions["Button1Link"](dataTexts[5]);
        updateFunctions["ContactButton"](dataTexts[6]);
        updateFunctions["ContactButtonEmail"](dataTexts[7]);
        updateFunctions["Name"](dataTexts[8]);
        updateFunctions["Role"](dataTexts[9]);
        updateFunctions["ButtonBackgroundColor"](dataTexts[11] || "#FFFFFF");

        const imageAvatar = await getImage(
          dataTexts[10],
          selectText + ".flr",
          "imageAvatar"
        );
        updateFunctions["ProfilePicture"](imageAvatar);

        const imageWebsite = await getImage(
          dataTexts[1],
          selectText + ".flr",
          "imageWebsite"
        );
        updateFunctions["Background"](imageWebsite);

        setCountBuilder(2);
      }
    },
    onError(error) {
      console.log("Error texts", error);
      setLoading(false);
    },
  });

  const mintWebsite = async (e: any) => {
    e.preventDefault();

    if (!isConnected || !isOwner) return false;

    setLoading(true);

    if (!formState.background) {
      alert("Please add a background");
      setLoading(false);
      return false;
    }

    if (!formState.profilePicture) {
      alert("Please add a profile picture");
      setLoading(false);
      return false;
    }

    // writeSetText?.();
    writeMulticall?.();
  };

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full"
    >
      <div className="flex-col bg-gray-800 px-4 sm:px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2">
        <HeaderBuilder
          selectText={selectText}
          setSelectText={setSelectText}
          setCountBuilder={setCountBuilder}
          setOwnedDomain={setOwnedDomain}
        />
        <Preview formState={formState} />
        <WebBuilderForm
          formState={formState}
          handleInputs={handleInputs}
          handleBackground={handleBackground}
          handleProfile={handleProfile}
          handleBackgroundColor={handleBackgroundColor}
          selectText={selectText}
          isOwner={isOwner}
          loading={loading}
          isReady={isReady}
          mintWebsite={mintWebsite}
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
