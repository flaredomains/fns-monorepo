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
  useAccount,
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
  GetObjectCommand,
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

  const { isConnected } = useAccount();

  // React Hooks
  const [countBuilder, setCountBuilder] = useState(0);
  const [ownedDomain, setOwnedDomain] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false); // State variable for disable mint button IF is not owner of the domain
  const [nameHash, setNameHash] = useState(""); // State variable for WRITE call on setText funciton
  const [keccakImageWebsite, setKeccakImageWebsite] = useState(""); // For uuid Image Website to put on Cloudflare database
  const [keccakImageAvatar, setKeccakImageAvatar] = useState(""); // For uuid Avatar Website to put on Cloudflare database
  const [loading, setLoading] = useState<boolean>(false); // For spinner on mint button

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

  const resetValue = () => {
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
  };

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
  }, [selectText, ownedDomain, formState.background, formState.profilePicture]);

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

  // Get Image from database
  async function getImage(uuid: string, domain: string, imageCategory: string) {
    try {
      const params = {
        Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
        Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
      };

      console.log("domain getImage:", domain);

      const response = (await s3Client.send(
        new GetObjectCommand(params)
      )) as any;
      // console.log("response", response);

      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const imagebase64 = await response.Body.transformToString();

      return imagebase64;
    } catch (error) {
      console.error("Error retrieving object:", error);
    }
  }

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
  // const { config: prepareSetText } = usePrepareContractWrite({
  //   address: PublicResolver.address as `0x${string}`,
  //   abi: PublicResolver.abi,
  //   functionName: "setText",
  //   args: [
  //     nameHash,
  //     "website.buttonBackgroundColor",
  //     formState.buttonBackgroundColor,
  //   ],
  //   // enabled: argsReady,
  //   onSuccess(data: any) {
  //     console.log("Success prepareSetText", data);
  //   },
  //   onError(error) {
  //     console.log("Error prepareSetText", error);
  //   },
  // });

  // Title
  const { config: prepareSetTitle } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.titleText", formState.title],
    enabled: formState.title !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareSetTitle", data.request.data);
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
    args: [nameHash, "website.bgPhotoHash", keccakImageWebsite],
    enabled: formState.background !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareSetBgPhotoHash", data.request.data);
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
    args: [nameHash, "website.body", formState.body],
    enabled: formState.body !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareSetBody", data.request.data);
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
    args: [nameHash, "website.theme", formState.theme],
    // enabled: formState.body !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareTheme", data.request.data);
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
    args: [nameHash, "website.button1", formState.button1],
    enabled: formState.button1 !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareButton1", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1", error);
    },
  });

  const { config: prepareButton1Link } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.button1Link", formState.button1Link],
    enabled: formState.button1Link !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareButton1Link", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1Link", error);
    },
  });

  const { config: prepareContactButton } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.contactButton", formState.contactButton],
    enabled: formState.contactButton !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareContactButton", data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButton", error);
    },
  });

  const { config: prepareContactButtonEmail } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [
      nameHash,
      "website.contactButtonEmail",
      formState.contactButtonEmail,
    ],
    enabled: formState.contactButtonEmail !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareContactButtonEmail", data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButtonEmail", error);
    },
  });

  const { config: prepareName } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.name", formState.name],
    enabled: formState.name !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareName", data.request.data);
    },
    onError(error) {
      console.log("Error prepareName", error);
    },
  });

  const { config: prepareRole } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.role", formState.role],
    enabled: formState.role !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareRole", data.request.data);
    },
    onError(error) {
      console.log("Error prepareRole", error);
    },
  });

  const { config: prepareProfilePicture } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.profilePicture", keccakImageAvatar],
    enabled: formState.profilePicture !== undefined,
    onSuccess(data: any) {
      console.log("Success prepareProfilePicture", data.request.data);
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
      nameHash,
      "website.buttonBackgroundColor",
      formState.buttonBackgroundColor,
    ],
    onSuccess(data: any) {
      console.log("Success prepareButtonBackgroundColor", data.request.data);
    },
    onError(error) {
      console.log("Error prepareButtonBackgroundColor", error);
    },
  });

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
        prepareSetTitle.request?.data,
        prepareSetBgPhotoHash.request?.data,
        prepareSetBody.request?.data,
        prepareTheme.request?.data,
        prepareButton1.request?.data,
        prepareButton1Link.request?.data,
        prepareContactButton.request?.data,
        prepareContactButtonEmail.request?.data,
        prepareName.request?.data,
        prepareRole.request?.data,
        prepareProfilePicture.request?.data,
        prepareButtonBackgroundColor.request?.data,
      ],
    ],
    enabled:
      prepareSetTitle.request?.data !== undefined &&
      prepareSetBgPhotoHash.request?.data !== undefined &&
      prepareSetBody.request?.data !== undefined &&
      prepareButton1.request?.data !== undefined &&
      prepareButton1Link.request?.data !== undefined &&
      prepareContactButton.request?.data !== undefined &&
      prepareContactButtonEmail.request?.data !== undefined &&
      prepareName.request?.data !== undefined &&
      prepareRole.request?.data !== undefined &&
      prepareProfilePicture.request?.data !== undefined,
    onSuccess(data: any) {
      console.log("Success multicall", data);
    },
    onError(error) {
      console.log("Error prepareSetMulticall", error);
    },
  });

  const { write: writeMulticall } = useContractWrite({
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

      // Waits for 1 txn confirmation (block confirmation)
      await data.wait(1);

      // Reset fields
      resetValue();

      setLoading(false);
      setOpen(true);
    },
    onError(data) {
      setLoading(false);
    },
  }) as any;

  // Write function for 'setText' call to set a text record on PublicResolver.
  // const { write: writeSetText } = useContractWrite({
  //   ...prepareSetText,
  //   async onSuccess(data) {
  //     console.log("Success writeSetText", data);

  //     // Waits for 1 txn confirmation (block confirmation)
  //     await data.wait(1);

  //     // Reset fields
  //     resetValue();

  //     setLoading(false);
  //     setOpen(true);
  //   },
  //   onError(data) {
  //     setLoading(false);
  //   },
  // }) as any;

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
      if (data[0]) {
        const imageKeccakWebsite = data[1];
        const imageKeccakAvatar = data[10];
        setoldUUIDWebsite(imageKeccakWebsite);
        setoldUUIDAvatar(imageKeccakAvatar);

        updateFunctions["Title"](data[0]);
        updateFunctions["Body"](data[2]);
        updateFunctions["Theme"](data[3]);
        updateFunctions["Button1"](data[4]);
        updateFunctions["Button1Link"](data[5]);
        updateFunctions["ContactButton"](data[6]);
        updateFunctions["ContactButtonEmail"](data[7]);
        updateFunctions["Name"](data[8]);
        updateFunctions["Role"](data[9]);
        updateFunctions["ButtonBackgroundColor"](data[11]);

        const imageAvatar = await getImage(
          data[10],
          selectText + ".flr",
          "imageAvatar"
        );
        updateFunctions["ProfilePicture"](imageAvatar);

        const imageWebsite = await getImage(
          data[1],
          selectText + ".flr",
          "imageWebsite"
        );
        updateFunctions["Background"](imageWebsite);
      } else {
        resetValue();
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
    }

    if (!formState.profilePicture) {
      alert("Please add a profile picture");
      setLoading(false);
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
