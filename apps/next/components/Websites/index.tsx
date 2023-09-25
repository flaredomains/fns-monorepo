import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import Check from "../../public/check-circle.png";
import Delete from "../../public/Delete.svg";
import WalletConnect from "../WalletConnect";
// import Link from "next/link";
import { Link } from "react-router-dom";
import AccountWeb from "./AccountWeb";

import { s3Client } from "../../lib/clientS3";

import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { encodeFunctionData } from "viem";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { namehash } from "viem/ens";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";
import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";

import { textKeys } from "../../lib/testkeys";

interface UpdateFunctions {
  [key: string]: Dispatch<SetStateAction<any>>;
}

const OwnedDomains = ({
  date,
  domain,
  isSubdomain,
  hasWebsite,
  deleteObjBucket,
  refetchText,
}: {
  date: Date;
  domain: string;
  isSubdomain: boolean;
  hasWebsite: boolean;
  deleteObjBucket: (
    domain: string,
    imageCategory: string,
    oldUUID: string
  ) => Promise<void>;
  refetchText: any;
}) => {
  const [prepareDelete, setPrepareDelete] = useState(false);
  const [keccakImageWebsite, setKeccakImageWebsite] = useState(""); // For uuid Image Website to put on Cloudflare database
  const [keccakImageAvatar, setKeccakImageAvatar] = useState(""); // For uuid Avatar Website to put on Cloudflare database

  const [isReady, setIsReady] = useState(false);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // console.log(`This domain ${domain} has a website --> ${hasWebsite}`);

  const [prepareMulticallArgs, setPrepareMulticallArgs] = useState({
    prepareSetTitle: "",
    prepareSetBgPhotoHash: "",
    prepareSetBody: "",
    prepareTheme: "",
    prepareButton1: "",
    prepareButton1Link: "",
    prepareContactButton: "",
    prepareContactButtonEmail: "",
    prepareName: "",
    prepareRole: "",
    prepareProfilePicture: "",
    prepareButtonBackgroundColor: "",
  });

  const preparationMulticall: UpdateFunctions = {
    prepareSetTitle: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetTitle: value,
      })),
    prepareSetBgPhotoHash: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetBgPhotoHash: value,
      })),
    prepareSetBody: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetBody: value,
      })),
    prepareTheme: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareTheme: value,
      })),
    prepareButton1: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButton1: value,
      })),
    prepareButton1Link: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButton1Link: value,
      })),
    prepareContactButton: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareContactButton: value,
      })),
    prepareContactButtonEmail: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareContactButtonEmail: value,
      })),
    prepareName: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareName: value,
      })),
    prepareRole: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareRole: value,
      })),
    prepareProfilePicture: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareProfilePicture: value,
      })),
    prepareButtonBackgroundColor: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButtonBackgroundColor: value,
      })),
  };

  // Website get keccak uuid to delete the image inside
  useContractRead({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "text",
    args: [namehash(domain + ".flr"), textKeys[1]],
    enabled: prepareDelete,
    onSuccess(data: any) {
      console.log("Success text Website uuid", data);

      setKeccakImageWebsite(data);
    },
  });

  // Avatar get keccak uuid to delete the image inside
  useContractRead({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "text",
    args: [namehash(domain + ".flr"), textKeys[10]],
    enabled: prepareDelete,
    onSuccess(data: any) {
      console.log("Success text Avatar uuid", data);

      setKeccakImageAvatar(data);
    },
  });

  // Title
  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.titleText", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetTitle", data.request.data);

      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.titleText", ""],
        });
        preparationMulticall["prepareSetTitle"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareSetTitle", error);
    },
  });

  // Image Website
  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.bgPhotoHash", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetBgPhotoHash", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.bgPhotoHash", ""],
        });
        preparationMulticall["prepareSetBgPhotoHash"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareSetBgPhotoHash", error);
    },
  });

  // Body
  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.body", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetBody", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.body", ""],
        });
        preparationMulticall["prepareSetBody"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareSetBody", error);
    },
  });

  // Theme
  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.theme", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareTheme", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.theme", ""],
        });
        preparationMulticall["prepareTheme"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareTheme", error);
    },
  });

  // Theme
  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.button1", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButton1", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.button1", ""],
        });
        preparationMulticall["prepareButton1"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareButton1", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.button1Link", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButton1Link", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.button1Link", ""],
        });
        preparationMulticall["prepareButton1Link"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareButton1Link", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.contactButton", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareContactButton", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.contactButton", ""],
        });
        preparationMulticall["prepareContactButton"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareContactButton", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.contactButtonEmail", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareContactButtonEmail", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.contactButtonEmail", ""],
        });
        preparationMulticall["prepareContactButtonEmail"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareContactButtonEmail", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.name", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareName", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.name", ""],
        });
        preparationMulticall["prepareName"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareName", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.role", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareRole", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.role", ""],
        });
        preparationMulticall["prepareRole"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareRole", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.profilePicture", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareProfilePicture", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [namehash(domain + ".flr"), "website.profilePicture", ""],
        });
        preparationMulticall["prepareProfilePicture"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareProfilePicture", error);
    },
  });

  usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [namehash(domain + ".flr"), "website.buttonBackgroundColor", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButtonBackgroundColor", data.request.data);
      if (data) {
        //@ts-ignore
        const encodedData = encodeFunctionData({
          abi: PublicResolver.abi,
          functionName: "setText",
          args: [
            namehash(domain + ".flr"),
            "website.buttonBackgroundColor",
            "",
          ],
        });
        preparationMulticall["prepareButtonBackgroundColor"](encodedData);
      }
    },
    onError(error) {
      console.log("Error prepareButtonBackgroundColor", error);
    },
  });

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
      prepareDelete &&
      keccakImageAvatar !== "" &&
      keccakImageWebsite !== "" &&
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
    },
  });

  useEffect(() => {
    if (isReady) {
      writeMulticall?.();
    }
  }, [isReady]);

  const { data: multicallData, write: writeMulticall } = useContractWrite({
    ...testMulticall,
    async onSuccess(data) {
      console.log("Success writeMulticall", data);

      // Website
      await deleteObjBucket(
        domain + ".flr",
        "imageWebsite",
        keccakImageWebsite
      ).catch((err: any) => {
        setPrepareDelete(false);
        console.log("Error on uploading image website", err);
      });

      // Avatar
      await await deleteObjBucket(
        domain + ".flr",
        "imageAvatar",
        keccakImageAvatar
      ).catch((err) => {
        setPrepareDelete(false);
        console.log("Error on uploading image website", err);
      });
    },
    onError(data) {
      setPrepareDelete(false);
    },
  }) as any;

  useWaitForTransaction({
    hash: multicallData?.hash,
    onSuccess(data) {
      console.log("Success multicallData", data);
      refetchText?.();
      setPrepareDelete(false);
    },
  });

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
            <div className="hidden sm:flex mr-2 px-2.5 py-0.5 bg-flarelink h-7 rounded-3xl justify-center items-center gap-1.5">
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
          {hasWebsite &&
            (prepareDelete ? (
              <svg
                aria-hidden="true"
                className={`w-5 h-5 ml-2 sm:ml-3 text-[#ffffff] dark:text-gray-500 animate-spin fill-[#ffffff]`}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentFill"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#F97316"
                />
              </svg>
            ) : (
              <Image
                onClick={() => setPrepareDelete(true)}
                className="h-5 w-5 ml-2 sm:ml-3 cursor-pointer"
                src={Delete}
                alt="Delete"
              />
            ))}
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
  const [hasWebsite, setHasWebsite] = useState<string[]>([]);

  // Cloudflare R2 DELETE request (old object image)
  const deleteObjBucket = async (
    domain: string,
    imageCategory: string,
    oldUUID: string
  ) => {
    try {
      const response = await s3Client.send(
        new DeleteObjectCommand({
          Bucket: `${domain}_${imageCategory}`,
          Key: `${oldUUID}`,
        })
      );
      // console.log("Deleted", response);
    } catch (error) {
      console.error("Error delete objects bucket:", error);
    }
  };

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
      if (data) {
        const arrDomains = data[0].slice(0, data[0].length);
        const ownedDomainFiltered = arrDomains.filter(
          (domain: any) => domain.label !== ""
        );
        const ownedDomain = ownedDomainFiltered.map((item: any, index: any) => {
          return {
            label: item.label,
            expire: Number(item.expiry),
            isSubdomain: /[a-zA-Z0-9]+\.{1}[a-zA-Z0-9]+/.test(item.label),
          };
        });
        const dataDomains = ownedDomainFiltered.map((item: any, index: any) => {
          return {
            address: PublicResolver.address as `0x${string}`,
            abi: PublicResolver.abi,
            functionName: "text",
            args: [namehash(item.label + ".flr"), "website.titleText"],
          };
        });
        setDataDomains(dataDomains);
        setAddressDomain(ownedDomain);
        setIsReady(true);
      }
    },
    onError(error) {
      console.error("Error getAll", error);
    },
  });

  // Performs all of the reads for the text record types and
  // returns an array of strings corresponding to each type.
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
      if (data) {
        setHasWebsite(data.map((obj: any) => obj.result));
      }
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
                hasWebsite={hasWebsite[index] !== "" && hasWebsite.length !== 0}
                deleteObjBucket={deleteObjBucket}
                refetchText={refetchText}
              />
            ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
