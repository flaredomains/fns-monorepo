import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import WalletConnect from "../WalletConnect";
import HeaderBuilder from "./HeaderBuilder";
import WebBuilderForm from "./WebBuilderForm";
import Preview from "./Preview";

import { useAccount } from "wagmi";

import { Step } from "../Register/Steps";

import { useLocation } from "react-router-dom";

import { utils } from "ethers";
import { keccak256 } from "js-sha3";

import PublicResolver from "../../src/pages/abi/PublicResolver.json";

import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
  const location = useLocation();

  // TODO after release smart contract: get the old
  // UUID if the domain as be minted in past
  // crypto Old uuid for test
  const [oldUUIDAvatar, setoldUUIDAvatar] = useState(
    "21cbe5ef5216a137536ad3680e29ce19234ffdcebccce22d5cf2043c98ea272c"
  );
  const [oldUUIDWebsite, setoldUUIDWebsite] = useState(
    "cfa4d42ba27501759eb69f34b6305bb6b7757de687fa2fbf166eab5b46c073a6"
  );

  const { address, isConnected } = useAccount();
  const [selectText, setSelectText] = useState("");

  const [countBuilder, setCountBuilder] = useState(0);

  const [formState, setFormState] = useState({
    title: undefined,
    background: undefined,
    body: undefined,
    theme: "glassmorphsm",
    button1: undefined,
    button1Link: undefined,
    contactButton: undefined,
    name: undefined,
    role: undefined,
    profilePicture: undefined,
    buttonBackgroundColor: "#FFFFFF",
  });

  useEffect(() => {
    // Check if there are any undefined values in formState
    const hasUndefinedValues = Object.values(formState).some(
      (value) => value === undefined
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

  // TODO Get uuid from smart contract
  // useEffect(() => {
  //   console.log("selectText", selectText);
  //   // Avatar
  //   // Change the first arg with the read call from smart contract
  //   getImage(
  //     "20158247f23c2461df48da9deff0fce9cd1352770dac02000bb4e2f070598ad6",
  //     selectText + ".flr",
  //     "imageAvatar"
  //   );

  //   // Website
  //   // Change the first arg with the read call from smart contract
  //   getImage(
  //     "deafffe548e3159a67a5cc01cdc29317c3d7e0acbbae77b59aa123f247b9d2ec",
  //     selectText + ".flr",
  //     "imageWebsite"
  //   );
  // }, [selectText]);

  // async function getImage(uuid: string, domain: string, imageCategory: string) {
  //   try {
  //     const params = {
  //       Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
  //       Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
  //     };

  //     console.log("domain getImage:", domain);

  //     const response = (await s3Client.send(
  //       new GetObjectCommand(params)
  //     )) as any;
  //     // console.log("response", response);

  //     // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
  //     // const imagebase64 = await response.Body.transformToString();

  //     // TODO: get the uuid from getImage
  //   } catch (error) {
  //     console.error("Error retrieving object:", error);
  //   }
  // }

  interface UpdateFunctions {
    [key: string]: Dispatch<SetStateAction<any>>;
  }

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
    ButtonBackgroundColor: (value) =>
      setFormState((prevState) => ({
        ...prevState,
        buttonBackgroundColor: value,
      })),
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

  // Cloudflare R2 POST request (create bucket if not exist)
  async function createBucket(domain: string, imageCategory: string) {
    try {
      const { Location } = await s3Client.send(
        new CreateBucketCommand({
          // The name of the bucket. Bucket names are unique and have several other constraints.
          // See https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
          Bucket: `${domain}_${imageCategory}`,
        })
      );
      console.log(`Bucket created with location ${Location}`);
    } catch (error) {
      console.error("Error create bucket:", error);
    }
  }

  // Cloudflare R2 DELETE request (old object image)
  async function deleteObjBucket(
    domain: string,
    imageCategory: string,
    oldUUID: string
  ) {
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
  }

  // Cloudflare R2 POST request (upload image)
  async function uploadImage(
    uuid: string,
    domain: string,
    image: string,
    imageCategory: string
  ) {
    // Set the parameters
    const params = {
      Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
      Body: image, // The content of the object. For example, 'Hello world!".
    };

    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results;
  }

  async function uploadImageCloudflare(
    uuid: string,
    domain: string,
    image: any,
    imageCategory: string,
    oldUUID?: string
  ) {
    try {
      if (oldUUID) {
        await deleteObjBucket(domain, imageCategory, oldUUID);
      }
      await createBucket(domain, imageCategory); // If there is already a bucket, nothing happens

      const results = await uploadImage(uuid, domain, image, imageCategory);

      // console.log("results", results);

      return results;
    } catch (error) {
      console.error("Error retrieving object:", error);
    }
  }

  // TODO put security requirement:
  // 1) the wallet is connected
  // 2) the domain belongs to the owner (to refetch the READ call every time the user change the owned domain)
  const mintWebsite = async (e: any) => {
    e.preventDefault();

    if (formState.background) {
      // console.log("test background");
      // await uploadImageCloudflare(
      //   keccak256(formState.background),
      //   selectText + ".flr",
      //   formState.background,
      //   "imageWebsite",
      //   oldUUIDWebsite
      // );
    } else {
      alert("Please add a background");
    }
    if (formState.profilePicture) {
      // console.log("test profile");
      // await uploadImageCloudflare(
      //   keccak256(formState.profilePicture),
      //   selectText + ".flr",
      //   formState.profilePicture,
      //   "imageAvatar",
      //   oldUUIDAvatar
      // );
    } else {
      alert("Please add a profile picture");
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
        <HeaderBuilder
          selectText={selectText}
          setSelectText={setSelectText}
          setCountBuilder={setCountBuilder}
        />
        <Preview formState={formState} />
        <WebBuilderForm
          handleInputs={handleInputs}
          handleBackground={handleBackground}
          handleProfile={handleProfile}
          handleBackgroundColor={handleBackgroundColor}
          selectText={selectText}
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
