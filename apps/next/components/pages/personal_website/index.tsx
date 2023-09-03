import React, { useState, useEffect } from "react";
import PageWebsite from "../../../components/Websites/PageWebsite";
import { useLocation, useNavigate } from "react-router-dom";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export default function Website() {
  const location = useLocation();
  const navigate = useNavigate();

  const [imageAvatarBase64, setImageAvatarBase64] = useState("");
  const [imageWebsiteBase64, setImageWebsiteBase64] = useState("");

  console.log("imageAvatarBase64", imageAvatarBase64);
  console.log("imageWebsiteBase64", imageWebsiteBase64);

  // Cloudflare R2 Config
  const apiUrl = process.env.CLOUDFLARE_R2_ENDPOINT;
  const REGION = "us-east-1";
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

      // TODO after release smart contract: get the old UUID and use it for get Images
      // Avatar
      getImage(
        "64c32dfbcf4b5ae242694f706a9175c7c36ac094d765a461b49d3e3aa3730109",
        domain,
        "imageAvatar",
        setImageAvatarBase64
      );

      // TODO after release smart contract: get the old UUID and use it for get Images
      // Website
      getImage(
        "ec5bc8a865465ef04423ed4d3210b0fb617000fe5183201ada2f6fd9ce1d330c",
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
