const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const fs = require("fs");
const { createHash } = require("crypto");

const apiUrl = process.env.CLOUDFLARE_R2_ENDPOINT;
const apiKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
console.log("accessKeyId", accessKeyId);
console.log("secretAccessKey", secretAccessKey);

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const REGION = "us-east-1"; //e.g. "us-east-1"

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: REGION,
  endpoint: apiUrl,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

interface CloudflareObject {
  uuid: string;
  domain: string;
  image: string;
}

// Function to calculate the keccak hash of an image data
function calculateImageHash(imageData: string): string {
  const hash = createHash("sha256");
  hash.update(imageData);
  return hash.digest("hex");
}

// const cloudflareObject: CloudflareObject = {
//   uuid,
//   domain,
//   image: imageBase64,
// };

async function uploadObjectToCloudflareR2(domain: string, imagePath: string) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const uuid = calculateImageHash(imageBase64);

    // Set the parameters
    const params = {
      Bucket: "fns", // The name of the bucket. For example, 'sample-bucket-101'.
      Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
      Body: imageBase64, // The content of the object. For example, 'Hello world!".
    };

    // console.log("Object upload successful:", response.data);
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results; // For unit tests.
  } catch (error) {
    console.error("Error uploading object:", error);
  }
}

// Function to retrieve an object using a GET request
async function getObjectFromCloudflareR2(uuid: string) {
  console.log("uuid", uuid);
  try {
    const params = {
      Bucket: "fns", // The name of the bucket. For example, 'sample-bucket-101'.
      Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
    };

    const response = await s3Client.send(new GetObjectCommand(params));
    // console.log("response", response);

    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();

    const imageBuffer = Buffer.from(str, "base64");

    // Handle the retrieved object data in 'response.data'
    fs.writeFileSync(`DownloadedImage-${uuid}.png`, imageBuffer); // Save the retrieved object
    console.log("Object retrieval successful. Object saved.");
  } catch (error) {
    console.error("Error retrieving object:", error);
  }
}

// function test(str: string) {
//   console.log("Test function:", str);
// }

// Example usage
async function main() {
  // test("Test");
  const imagePath = "./PreviewImage.png"; // Replace with the actual image path in your folder
  const domain = "example.com"; // Replace with the domain
  // await uploadObjectToCloudflareR2(domain, imagePath);

  const uuid =
    "91ac64a1a67f12bdae93e2a282f09f4fc548b110645a7fe7f242c3bba9cbf4cb";
  await getObjectFromCloudflareR2(uuid);
}

// Call the main function to test the upload and retrieval
main();
