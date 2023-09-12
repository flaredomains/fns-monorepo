import React, { useState } from "react";
import Image from "next/image";
import Avatar from "../../public/Avatar.svg";
import Check from "../../public/check-circle.png";
import Delete from "../../public/Delete.svg";
import WalletConnect from "../WalletConnect";
// import Link from "next/link";
import { Link } from "react-router-dom";
import AccountWeb from "./AccountWeb";

import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { utils } from "ethers";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";
import MintedDomainNames from "../../src/pages/abi/MintedDomainNames.json";

const textKeys: Array<string> = [
  "website.titleText",
  "website.bgPhotoHash",
  "website.body",
  "website.theme",
  "website.button1",
  "website.button1Link",
  "website.contactButton",
  "website.contactButtonEmail",
  "website.name",
  "website.role",
  "website.profilePicture",
  "website.buttonBackgroundColor",
];

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

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // console.log(`This domain ${domain} has a website --> ${hasWebsite}`);

  // Website get keccak uuid to delete the image inside
  useContractRead({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "text",
    args: [utils.namehash(domain + ".flr"), textKeys[1]],
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
    args: [utils.namehash(domain + ".flr"), textKeys[10]],
    enabled: prepareDelete,
    onSuccess(data: any) {
      console.log("Success text Avatar uuid", data);

      setKeccakImageAvatar(data);
    },
  });

  // Title
  const { config: prepareSetTitle } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.titleText", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetTitle", data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetTitle", error);
    },
  });

  // Image Website
  const { config: prepareSetBgPhotoHash } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.bgPhotoHash", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetBgPhotoHash", data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetBgPhotoHash", error);
    },
  });

  // Body
  const { config: prepareSetBody } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.body", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareSetBody", data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetBody", error);
    },
  });

  // Theme
  const { config: prepareTheme } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.theme", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareTheme", data.request.data);
    },
    onError(error) {
      console.log("Error prepareTheme", error);
    },
  });

  // Theme
  const { config: prepareButton1 } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.button1", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButton1", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1", error);
    },
  });

  const { config: prepareButton1Link } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.button1Link", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButton1Link", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1Link", error);
    },
  });

  const { config: prepareContactButton } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.contactButton", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareContactButton", data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButton", error);
    },
  });

  const { config: prepareContactButtonEmail } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.contactButtonEmail", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareContactButtonEmail", data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButtonEmail", error);
    },
  });

  const { config: prepareName } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.name", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareName", data.request.data);
    },
    onError(error) {
      console.log("Error prepareName", error);
    },
  });

  const { config: prepareRole } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.role", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareRole", data.request.data);
    },
    onError(error) {
      console.log("Error prepareRole", error);
    },
  });

  const { config: prepareProfilePicture } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [utils.namehash(domain + ".flr"), "website.profilePicture", ""],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareProfilePicture", data.request.data);
    },
    onError(error) {
      console.log("Error prepareProfilePicture", error);
    },
  });

  const { config: prepareButtonBackgroundColor } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [
      utils.namehash(domain + ".flr"),
      "website.buttonBackgroundColor",
      "",
    ],
    enabled: prepareDelete,
    onSuccess(data: any) {
      // console.log("Success prepareButtonBackgroundColor", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButtonBackgroundColor", error);
    },
  });

  // const { config: testMulticall } = usePrepareContractWrite({
  //   address: PublicResolver.address as `0x${string}`,
  //   abi: PublicResolver.abi,
  //   functionName: "multicall",
  //   args: [
  //     [
  //       prepareSetTitle.request?.data,
  //       prepareSetBgPhotoHash.request?.data,
  //       prepareSetBody.request?.data,
  //       prepareTheme.request?.data,
  //       prepareButton1.request?.data,
  //       prepareButton1Link.request?.data,
  //       prepareContactButton.request?.data,
  //       prepareContactButtonEmail.request?.data,
  //       prepareName.request?.data,
  //       prepareRole.request?.data,
  //       prepareProfilePicture.request?.data,
  //       prepareButtonBackgroundColor.request?.data,
  //     ],
  //   ],
  //   enabled:
  //     prepareDelete &&
  //     keccakImageAvatar !== "" &&
  //     keccakImageWebsite !== "" &&
  //     prepareSetTitle.request?.data !== undefined &&
  //     prepareSetBgPhotoHash.request?.data !== undefined &&
  //     prepareSetBody.request?.data !== undefined &&
  //     prepareButton1.request?.data !== undefined &&
  //     prepareButton1Link.request?.data !== undefined &&
  //     prepareContactButton.request?.data !== undefined &&
  //     prepareContactButtonEmail.request?.data !== undefined &&
  //     prepareName.request?.data !== undefined &&
  //     prepareRole.request?.data !== undefined &&
  //     prepareProfilePicture.request?.data !== undefined,
  //   onSuccess(data: any) {
  //     console.log("Success multicall", data);
  //     writeMulticall?.();
  //   },
  //   onError(error) {
  //     console.log("Error prepareSetMulticall", error);
  //   },
  // });

  // const { write: writeMulticall } = useContractWrite({
  //   ...testMulticall,
  //   async onSuccess(data) {
  //     console.log("Success writeMulticall", data);

  //     // Website
  //     await deleteObjBucket(
  //       domain + ".flr",
  //       "imageWebsite",
  //       keccakImageWebsite
  //     ).catch((err: any) => {
  //       setPrepareDelete(false);
  //       console.log("Error on uploading image website", err);
  //     });

  //     // Avatar
  //     await await deleteObjBucket(
  //       domain + ".flr",
  //       "imageAvatar",
  //       keccakImageAvatar
  //     ).catch((err) => {
  //       setPrepareDelete(false);
  //       console.log("Error on uploading image website", err);
  //     });

  //     // Waits for 1 txn confirmation (block confirmation)
  //     await data.wait(1);

  //     refetchText?.();
  //     setPrepareDelete(false);
  //   },
  //   onError(data) {
  //     setPrepareDelete(false);
  //   },
  // }) as any;

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
            <div className="hidden sm:flex mr-2 px-2.5 py-0.5 bg-orange-500 h-7 rounded-3xl justify-center items-center gap-1.5">
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
  // Cloudflare R2 Config
  const apiUrl = process.env.CLOUDFLARE_R2_ENDPOINT;
  const REGION = "us-east-1"; //e.g. "us-east-1"
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  // Create an Amazon S3 service client object.
  const s3Client = new S3Client({
    region: REGION,
    endpoint: apiUrl,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });

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
        const arrDomains = data[0].slice(0, data[0]._length);
        const ownedDomain = arrDomains.map((item: any, index: any) => {
          return {
            label: item.label,
            expire: Number(item.expiry),
            isSubdomain: /[a-zA-Z0-9]+\.{1}[a-zA-Z0-9]+/.test(item.label),
          };
        });
        const dataDomains = arrDomains.map((item: any, index: any) => {
          return {
            address: PublicResolver.address as `0x${string}`,
            abi: PublicResolver.abi,
            functionName: "text",
            args: [utils.namehash(item.label + ".flr"), "website.titleText"],
          };
        });
        // console.log("dataDomains", dataDomains);
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
