import React, { useEffect } from "react";
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

  return (
    <div className="min-h-screen">
      <PageWebsite />
    </div>
  );
}
