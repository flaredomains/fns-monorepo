import {
  S3Client,
  GetObjectCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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

// Get Image from database
async function getImage(uuid: string, domain: string, imageCategory: string) {
  try {
    const params = {
      Bucket: `${domain}_${imageCategory}`, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: uuid, // The name of the object. For example, 'sample_upload.txt'.
    };

    const response = (await s3Client.send(new GetObjectCommand(params))) as any;

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
    console.log(`Bucket created`);
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

    return results;
  } catch (error) {
    console.error("Error retrieving object:", error);
  }
}

export { s3Client, getImage, uploadImageCloudflare };
