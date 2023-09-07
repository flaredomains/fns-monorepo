import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import WalletConnect from "../WalletConnect";
import HeaderBuilder from "./HeaderBuilder";
import WebBuilderForm from "./WebBuilderForm";
import Preview from "./Preview";
import { Step } from "../Register/Steps";
import { useLocation } from "react-router-dom";
import { utils } from "ethers";
import { keccak256 } from "js-sha3";

// For READ / WRITE call smart contract
import {
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";

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

  const [oldUUIDAvatar, setoldUUIDAvatar] = useState("");
  const [oldUUIDWebsite, setoldUUIDWebsite] = useState("");

  // React Hooks
  const [countBuilder, setCountBuilder] = useState(0);
  const [ownedDomain, setOwnedDomain] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [nameHash, setNameHash] = useState("");
  const [keccakImageWebsite, setKeccakImageWebsite] = useState("");
  const [keccakImageAvatar, setKeccakImageAvatar] = useState("");

  const [formState, setFormState] = useState({
    title: undefined,
    background: undefined,
    body: undefined,
    theme: "glassmorphsm",
    button1: undefined,
    button1Link: undefined,
    contactButton: undefined,
    contactButtonEmail: undefined,
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

  useEffect(() => {
    if (ownedDomain) {
      setIsOwner(ownedDomain.includes(selectText));
    }
    if (selectText) {
      setNameHash(utils.namehash(selectText + ".flr"));
      setCountBuilder(1);
    }
    if (formState.background) {
      setKeccakImageWebsite(keccak256(formState.background));
    }
    if (formState.profilePicture) {
      setKeccakImageAvatar(keccak256(formState.profilePicture));
    }
  }, [selectText, ownedDomain, formState.background]);

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
    ContactButtonEmail: (value) =>
      setFormState((prevState) => ({
        ...prevState,
        contactButtonEmail: value,
      })),
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

  // WAGMI TEXT RECORD WRITE FUNCTION, active when === false
  // setText(namehash(domainName), keyString, valueString)
  // Example Usage:
  // To set email:
  // setText(namehash, "email", "simone@gmail.com")
  const { config: prepareSetText } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.bgPhotoHash", keccakImageWebsite],
    // enabled: argsReady,
    onSuccess(data: any) {
      console.log("Success prepareSetText", data);
    },
    onError(error) {
      console.log("Error prepareSetText", error);
    },
  });

  // Write function for 'setText' call to set a text record on PublicResolver.
  const { write: writeSetText } = useContractWrite({
    ...prepareSetText,
    async onSuccess(data) {
      console.log("Success writeSetText", data);

      // Waits for 2 txn confirmation (block confirmation)
      await data.wait(2);
      refetchText();

      // Reset fields
      updateFunctions["Title"]("");
      updateFunctions["Body"]("");
      updateFunctions["Background"](undefined);
      updateFunctions["Button1"]("");
      updateFunctions["Button1Link"]("");
      updateFunctions["ContactButton"]("");
      updateFunctions["ContactButtonEmail"]("");
      updateFunctions["Name"]("");
      updateFunctions["Role"]("");
      updateFunctions["ProfilePicture"](undefined);
      updateFunctions["ButtonBackgroundColor"]("");

      setOpen(true);
    },
  }) as any;

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
    onSuccess(data: any) {
      console.log("Success texts", data);
      const imageKeccakWebsite = data[1];
      const imageKeccakAvatar = data[10];
      setoldUUIDWebsite(imageKeccakWebsite);
      setoldUUIDAvatar(imageKeccakAvatar);
    },
    onError(error) {
      console.log("Error texts", error);
    },
  });

  const mintWebsite = async (e: any) => {
    e.preventDefault();

    if (formState.background) {
      // console.log("test background");
      await uploadImageCloudflare(
        keccakImageWebsite,
        selectText + ".flr",
        formState.background,
        "imageWebsite",
        oldUUIDWebsite
      );
    } else {
      alert("Please add a background");
    }
    // if (formState.profilePicture) {
    //   // console.log("test profile");
    //   await uploadImageCloudflare(
    //     keccakImageAvatar,
    //     selectText + ".flr",
    //     formState.profilePicture,
    //     "imageAvatar",
    //     oldUUIDAvatar
    //   );
    // } else {
    //   alert("Please add a profile picture");
    // }
    writeSetText?.();
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
