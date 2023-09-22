import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import PageWebsite from "../../../components/Websites/PageWebsite";
import { useLocation, useNavigate } from "react-router-dom";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// For READ / WRITE call smart contract
import { useContractReads } from "wagmi";
import { namehash } from "viem";

// ABIS
import PublicResolver from "../../../src/pages/abi/PublicResolver.json";

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

export default function Website() {
  const location = useLocation();
  const navigate = useNavigate();

  const [imageAvatarBase64, setImageAvatarBase64] = useState("");
  const [imageWebsiteBase64, setImageWebsiteBase64] = useState("");

  // console.log("imageAvatarBase64", imageAvatarBase64);
  // console.log("imageWebsiteBase64", imageWebsiteBase64);

  // Cloudflare R2 Config
  const apiUrl = process.env.CLOUDFLARE_R2_ENDPOINT;
  const REGION = "us-east-1";
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  // Create an Amazon S3 service client object
  const s3Client = new S3Client({
    region: REGION,
    endpoint: apiUrl,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });

  const [nameHash, setNameHash] = useState("");
  const [domain, setDomain] = useState("");

  const [websiteData, setWebsiteData] = useState({
    title: "",
    background: undefined,
    body: "",
    theme: "glassmorphsm",
    button1: "",
    button1Link: "",
    contactButton: "",
    contactButtonEmail: undefined,
    name: "",
    role: "",
    profilePicture: undefined,
    buttonBackgroundColor: "#FFFFFF",
  });

  interface UpdateFunctions {
    [key: string]: Dispatch<SetStateAction<any>>;
  }

  const updateFunctions: UpdateFunctions = {
    title: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, title: value })),
    body: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, body: value })),
    background: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, background: value })),
    theme: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, theme: value })),
    button1: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, button1: value })),
    button1Link: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, button1Link: value })),
    contactButton: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, contactButton: value })),
    contactButtonEmail: (value) =>
      setWebsiteData((prevState) => ({
        ...prevState,
        contactButtonEmail: value,
      })),
    name: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, name: value })),
    role: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, role: value })),
    profilePicture: (value) =>
      setWebsiteData((prevState) => ({ ...prevState, profilePicture: value })),
    buttonBackgroundColor: (value) =>
      setWebsiteData((prevState) => ({
        ...prevState,
        buttonBackgroundColor: value,
      })),
  };

  useEffect(() => {
    if (location) {
      const lastIndex = location.pathname.lastIndexOf("/");

      const domain = location.pathname.substring(lastIndex + 1);
      // console.log("domain", domain);
      setNameHash(namehash(domain));
      setDomain(domain);

      if (typeof domain === "string" && !domain.endsWith(".flr")) {
        // Redirect to 404 page if URL doesn't end with ".flr"
        navigate("/404");
      }
    }

    async function getObjectFromCloudflareR2(uuid: string) {
      try {
        const params = {
          Bucket: "fns", // The name of the bucket. For example, 'sample-bucket-101'.
          Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
        };

        // const  = new GetObject(params);
        // console.log("aaa");
        const response = await s3Client.send(new GetObjectCommand(params));
        console.log("response", response);
        // const imageBuffer = Buffer.from(response, 'base64');

        // // Handle the retrieved object data in 'response.data'
        // fs.writeFileSync(`downloaded-${uuid}`, imageBuffer); // Save the retrieved object
        console.log("Object retrieval successful. Object saved.");
      } catch (error) {
        console.error("Error retrieving object:", error);
      }
    }

    getObjectFromCloudflareR2("00001");
  }, [location]);

  async function getImage(
    uuid: string,
    domain: string,
    imageCategory: string,
    setImage: React.Dispatch<React.SetStateAction<string>>
  ) {
    try {
      const params = {
        Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
        Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
      };

      const response = (await s3Client.send(
        new GetObjectCommand(params)
      )) as any;
      // console.log("response", response);

      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const imagebase64 = await response.Body.transformToString();

      setImage(imagebase64);
    } catch (error) {
      console.error("Error retrieving object:", error);
    }
  }

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
      if (data) {
        const dataTexts = data.map((obj: any) => obj.result);

        const imageWebsiteBase64 = dataTexts[1];
        const imageAvatarBase64 = dataTexts[10];

        if (dataTexts[0] === "") {
          navigate("/404");
        }

        const updatedFormState = { ...websiteData };
        dataTexts.forEach((value: any, index: any) => {
          const key = Object.keys(updatedFormState)[index];
          // console.log("key", key);
          // console.log("updateFunctions[key]", updateFunctions[key]);
          const updateFunction = updateFunctions[key];
          if (updateFunction) {
            updateFunction(value);
          }
        });

        // Avatar
        getImage(
          imageAvatarBase64,
          domain,
          "imageAvatar",
          setImageAvatarBase64
        );

        // Website
        getImage(
          imageWebsiteBase64,
          domain,
          "imageWebsite",
          setImageWebsiteBase64
        );
      }
    },
    onError(error) {
      console.log("Error texts", error);
    },
  });

  return (
    <div className="min-h-screen">
      <PageWebsite
        imageAvatarBase64={imageAvatarBase64}
        imageWebsiteBase64={imageWebsiteBase64}
        websiteData={websiteData}
      />
    </div>
  );
}
