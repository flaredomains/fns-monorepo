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
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
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

// Function to calculate the keccak hash of an image data
function calculateImageHash(imageData: string): string {
  const hash = createHash("sha256");
  hash.update(imageData);
  return hash.digest("hex");
}

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

async function deleteObjBucket(
  domain: string,
  imageCategory: string,
  oldImage: string
) {
  try {
    const response = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: `${domain}_${imageCategory}`,
        Key: `${oldImage}`,
      })
    );
    console.log("Deleted", response);
  } catch (error) {
    console.error("Error delete objects bucket:", error);
  }
}

async function uploadImage(
  domain: string,
  image: string,
  imageCategory: string
) {
  const imageBufferWeb = fs.readFileSync(image);
  const imageBase64 = imageBufferWeb.toString("base64");

  const uuid = calculateImageHash(imageBase64);

  // Set the parameters
  const params = {
    Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
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
}

async function uploadImageCloudflare(
  domain: string,
  imageWebsite: string,
  imageCategory: string,
  oldImage?: string
) {
  try {
    if (oldImage) {
      await deleteObjBucket(domain, imageCategory, oldImage);
    }
    await createBucket(domain, imageCategory); // If there is already a bucket, nothing happens

    const results = await uploadImage(domain, imageWebsite, imageCategory);
    return results;
  } catch (error) {
    console.error("Error uploading object:", error);
  }
}

// Function to retrieve an object using a GET request
async function getImage(uuid: string, domain: string, imageCategory: string) {
  try {
    const params = {
      Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
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

async function main() {
  const imageWebsite = "./landscape.jpg";
  const imageAvatar = "./cropped.jpg";
  const domain = "crypto.flr";
  const imageCategory = ["imageAvatar", "imageWebsite"];

  // Upload Avatar image
  await uploadImageCloudflare(
    domain,
    imageAvatar,
    imageCategory[0],
    "09aa89892fcb03243eea2f00a588b30c35104a98f238402d50708b18836f5e5d" // Get this from the smart contract
  );

  // Upload Website image
  await uploadImageCloudflare(
    domain,
    imageWebsite,
    imageCategory[1],
    "91ac64a1a67f12bdae93e2a282f09f4fc548b110645a7fe7f242c3bba9cbf4cb" // Get this from the smart contract
  );

  // Get uuid from smart contract
  const uuidAvatar =
    "09aa89892fcb03243eea2f00a588b30c35104a98f238402d50708b18836f5e5d";

  const uuidWebsite =
    "91ac64a1a67f12bdae93e2a282f09f4fc548b110645a7fe7f242c3bba9cbf4cb";

  // Get Avatar Image
  await getImage(uuidAvatar, domain, imageCategory[0]);

  // Get Website Image
  await getImage(uuidWebsite, domain, imageCategory[1]);
}

main();

// interface CloudflareObject {
//   uuid: string;
//   domain: string;
//   image: string;
// }

// const cloudflareObject: CloudflareObject = {
//   uuid,
//   domain,
//   image: imageBase64,
// };
