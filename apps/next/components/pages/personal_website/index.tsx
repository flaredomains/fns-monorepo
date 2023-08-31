import React, { useState, useEffect } from "react";
import PageWebsite from "../../../components/Websites/PageWebsite";
import { useLocation, useNavigate } from "react-router-dom";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export default function Website() {
  const location = useLocation();
  const navigate = useNavigate();

  const [imageAvatarBase64, setImageAvatarBase64] = useState("");
  const [imageWebsiteBase64, setImageWebsiteBase64] = useState("");

  const apiUrl = process.env.CLOUDFLARE_R2_ENDPOINT;
  // console.log(test);
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

  // const client = new S3Client()

  useEffect(() => {
    if (location) {
      const lastIndex = location.pathname.lastIndexOf("/");

      const domain = location.pathname.substring(lastIndex + 1);
      console.log("domain", domain);

      if (typeof domain === "string" && !domain.endsWith(".flr")) {
        // Redirect to 404 page if URL doesn't end with ".flr"
        navigate("/404");
      }

      // Avatar
      getImage(
        "20158247f23c2461df48da9deff0fce9cd1352770dac02000bb4e2f070598ad6",
        domain,
        "imageAvatar",
        setImageAvatarBase64
      );

      // Website
      getImage(
        "deafffe548e3159a67a5cc01cdc29317c3d7e0acbbae77b59aa123f247b9d2ec",
        domain,
        "imageWebsite",
        setImageWebsiteBase64
      );
    }

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
  }, [location]);

  return (
    <div className="min-h-screen">
      <PageWebsite
        imageAvatarBase64={imageAvatarBase64}
        imageWebsiteBase64={imageWebsiteBase64}
      />
    </div>
  );
}
