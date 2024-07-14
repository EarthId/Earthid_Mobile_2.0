
import AWS from 'aws-sdk';
import RNFetchBlob from 'rn-fetch-blob';
//import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "@env";

//AWS S3 bucket
const bucketName = 'idv-sessions'
// AWS credentials
const accessKey = 'AKIAU4JK3LMEAKCXLXWE';
const secretKey = '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';

// const accessKey = AWS_ACCESS_KEY_ID
// const secretKey = AWS_SECRET_ACCESS_KEY

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

//Not being used anymore
export async function createUserSpecificBucket(username:any) {

    try {
      const s3 = new AWS.S3();
      
      // Generate a unique bucket name based on the username (you can modify this as needed).
      const bucketName = `idv-sessions-${username.toLowerCase()}`;
  
      const params = {
        Bucket: bucketName,
        ACL: 'private', // Set ACL to 'private' if you want to restrict access to the bucket.
      };
  
      // Create the bucket
      const news3 = await s3.createBucket(params).promise();
    
      
      return bucketName;
    } catch (error) {
     console.log('createUserSpecificBucketerror====>',error)
      return null;
    }
  }

  export async function checkBucketExists(bucketName: string) {
    try {
      const s3 = new AWS.S3();
    const res =  await s3.headBucket({ Bucket: bucketName }).promise();
     console.log('response===>',res)
      return true
    } catch (error) {
      return false
    }
  }

 export const listBuckets = async () => {
  const s3 = new AWS.S3();
    try {
      const response:any = await s3.listBuckets().promise();
      const bucketNames = response.Buckets.map((bucket: { Name: any; }) => bucket.Name);
      return bucketNames
    } catch (error) {
      console.log('Error listing buckets:', error);
    }
  };


  const deleteAllObjectsInBucket = async (bucketName: any) => {
    const s3 = new AWS.S3();
    try {
      const objectsResponse:any = await s3.listObjectsV2({ Bucket: bucketName }).promise();
      const objectsToDelete = objectsResponse.Contents.map((object: { Key: any; }) => ({ Key: object.Key }));
  
      if (objectsToDelete.length > 0) {
        await s3.deleteObjects({
          Bucket: bucketName,
          Delete: { Objects: objectsToDelete },
        }).promise();
      }
     
    } catch (error) {
      console.log('Error deleting objects in bucket:', error);
    }
  };
  
  
  export const deleteAllBuckets = async () => {
    const s3 = new AWS.S3();
    const bucketNames = await listBuckets();
    console.log('bucketNames====>',bucketNames)
  
    if (bucketNames && bucketNames.length > 0) {
      for (const bucketName of bucketNames) {
        await deleteAllObjectsInBucket(bucketName);
        await s3.deleteBucket({ Bucket: bucketName }).promise();
       
      }
    }
  };

  export const deleteSingleBucket =async (bucketName: string)=>{
    const s3 = new AWS.S3();
    try {
      await deleteAllObjectsInBucket(bucketName);
      await s3.deleteBucket({ Bucket: bucketName }).promise();
    }
    catch (error) {
      console.log('Error deleting objects in bucket:', error);
    }
   
  }
  
  
  
  

  export function mapCountryCodeToRegion(countryCode:any) {
    const countryToRegionMap : any = {
      'US': 'us-west-2', // Example region mapping for the United States
      'IN': 'ap-south-1', // Example region mapping for India
      // Add more region mappings as needed
    };
  
    return countryToRegionMap[countryCode] || 'us-west-2'; // Default to a region (e.g., us-west-2) if not found in the map
  }

  export async function generatePreSignedURL(bucketName:any, objectKeys:any, expirationInSeconds = 3600) {
    try {
      const s3 = new AWS.S3({ signatureVersion: 'v4' });
  
      const params = {
        Bucket: bucketName,
        Key: objectKeys,
        Expires: expirationInSeconds,
      };
  
      const url = await s3.getSignedUrlPromise('getObject', params);
  
      return url;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      return null;
    }
  }

  export async function uploadImageToS3(bucketName:any, objectKey:any,base64Image:any,contentType:any) {
    try {
      const s3 = new AWS.S3();
      
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        // Body: {
        //   uri: imageUri,
        // },
      //  Body: base64Image,
       Body: Buffer.from(base64Image, 'base64'),
       ContentType:contentType,
        ACL: 'private', // Set ACL to 'public-read' to make the uploaded image publicly accessible
      };

    
      const result = await s3.upload(params).promise();
  
      return result.Key;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  }


  export async function uploadPDFToS3(bucketName:any, objectKey:any,base64Data:any) {
    try {
      const s3 = new AWS.S3();
      
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        // Body: {
        //   uri: imageUri,
        // },
      //  Body: base64Image,
      Body: Buffer.from(base64Data, 'base64'),
      ContentType: 'application/pdf', // Set the correct content type
       ACL: 'private', // Set ACL to 'public-read' to make the uploaded image publicly accessible
      };

    
      const result = await s3.upload(params).promise();
  
      return result.Key;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  }

  export async function uploadDocToS3(bucketName:any, objectKey:any,base64Data:any,type:string) {
    try {
      const s3 = new AWS.S3();
      
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        // Body: {
        //   uri: imageUri,
        // },
      //  Body: base64Image,
      Body: Buffer.from(base64Data, 'base64'),
      ContentType:type, // Set the correct content type
       ACL: 'private', // Set ACL to 'public-read' to make the uploaded image publicly accessible
      };

    
      const result = await s3.upload(params).promise();
  
      return result.Key;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  }


  export async function uploadJSONToS3(bucketName:any, objectKey:any,jsonObject:any,contentType:any) {
    try {
      const s3 = new AWS.S3();
      
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        Body: JSON.stringify(jsonObject),
        ContentType:contentType,
        ACL: 'private', // Set ACL to 'public-read' to make the uploaded image publicly accessible
      };
      console.log('params===>',JSON.stringify(params))
      const result = await s3.upload(params).promise();
  
      return result.Key;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  }
  
