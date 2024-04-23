import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage,
} from "react-native";

import RNFetchBlob from "rn-fetch-blob";

import Button from "../../components/Button";
import Header from "../../components/Header";
import SuccessPopUp from "../../components/Loader";
import AnimatedLoader from "../../components/Loader/AnimatedLoader";
import { LocalImages } from "../../constants/imageUrlConstants";
import { CreateHistory } from "../../utils/earthid_account";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useFetch } from "../../hooks/use-fetch";
import {
  getHistory,
  saveDocuments,
  updateDocuments,
} from "../../redux/actions/authenticationAction";
import { Screens } from "../../themes/index";
import {
  cryptoTransferApi,
  facialDataLivenessAPI,
  MD5,
  selfieeverifyAPI,
} from "../../utils/earthid_account";
import { dateTime } from "../../utils/encryption";
import GenericText from "../../components/Text";
import { uploadRegisterDocument } from "../../utils/earthid_account";
import { Buffer } from 'buffer';
import axios from "axios";
import {createVerification, uploadImage, updateVerificationStatus, getSessionDecision, getMediaData} from '../../utils/veriffApis'
import ErrorPopUp from "../../components/Loader/errorPopup";


export interface IDocumentProps {
  id: string;
  name: string;
  path: string;
  date: string;
  time: string;
  txId: string;
  documentName: string;
  docName: string;
  isLivenessImage: string;
  docType: string;
  docExt: string;
  processedDoc: string;
  vc: any;
  isVc: boolean;
  base64: any;
  pdf?: boolean;
  categoryType?: any;
  color?: string;
  isVerifyNeeded?: boolean;
  signature: any;
  typePDF: any;
  verifiableCredential: any;
}
const VerifiDocumentScreen = (props: any) => {
  const { uploadedDocuments } = props.route.params;
  const { pic } = props.route.params;
  const {fileUriBack} = props.route.params;
  const { editDoc, selectedItem, docname } = props?.route?.params;
  const { faceImageData, selectedDocument } = props.route.params;
  const { loading, data, error, fetch: uploadRegDoc } = useFetch();
  const userDetails = useAppSelector((state) => state.account);
  const keys = useAppSelector((state) => state.user);
  const getHistoryReducer = useAppSelector((state) => state.getHistoryReducer);
  console.log("getHistoryReducer===>", getHistoryReducer);
  const {
    loading: documentaDDINGerror,
    data: DataAdded,
    error: documentAddedError,
    fetch: AddDocumehtfetch,
  } = useFetch();
  // console.log("picLOG", editDoc);
  // console.log("picLOG", docname);

  const [load, setLoad] = useState(false);
  const dispatch = useAppDispatch();
  const [successResponse, setsuccessResponse] = useState(false);
  const [errorResponse, seterrorResponse] = useState(false);
  let documentsDetailsList = useAppSelector((state) => state.Documents);
  var base64Icon = `data:image/png;base64,${faceImageData?.base64}`;
  var uploadedDocumentsBase64 = `data:image/png;base64,${uploadedDocuments?.base64}`;
  var name: any = "";
  const [verifyVcCred, setverifyVcCred] = useState<any>();
  const [dis, SetDis] = useState(false);

  

  // if(uploadedDocumentsBase64 && base64Icon){
  //   console.log('UploadedDoc64', uploadedDocumentsBase64, 'selfie64', base64Icon)
  // }
  
  useEffect(() => {
    getVcdata();
  }, []);

  const getVcdata = async () => {
    const getvcCred: any = await AsyncStorage.getItem("vcCred");
    const parseData = JSON.parse(getvcCred);
    console.log("parseData", parseData);
    setverifyVcCred(parseData);
  };



// Function to convert image file to base64 format
const getBase64FromImageURI = async (uri: any) => {
  if (!uri) {
    throw new Error('URI is undefined or null');
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};


// Function to send base64 images to API
const sendImagesToAPIGBG = async () => {
  let docImage64
  if(pic && pic.uri){
    docImage64 = await getBase64FromImageURI(pic.uri)
    
  }else if(selectedItem.base64){
    docImage64 = selectedItem.base64
  }else(
    docImage64 = uploadedDocuments.base64
  )
  let docBack64
  if(fileUriBack){
docBack64 = await getBase64FromImageURI(fileUriBack.uri)
  }
  const faceImage64 = faceImageData?.base64

  const images = [docImage64, faceImage64];
//console.log('Uploaded Doc base64', docImage64)
  try {
    const data = JSON.stringify({ images });
    const config = {
      method: 'post',
      url: 'https://apitest.myearth.id/user/upload',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };
    
    const response = await axios.request(config);
    console.log('DocumentGBGResponse', response.data.data); 
    console.log('Extracted fields',response.data.data.ProcessedDocuments[0].ExtractedFields)// Access response data here
   return response.data.data
    // Handle response from the API as needed
  } catch (error) {
    console.error("Error sending images to API:", error);
    // Handle error
  }
};

const createPayLoadFromDocumentData = async (documentResponseData: any, uploadDocVcResponse: any) => {
  console.log("Username:", documentResponseData?.person?.firstName?.value);
  console.log("Date of Birth:", documentResponseData?.person?.dateOfBirth?.value);

  const username = documentResponseData?.person?.firstName?.value ?? null;
  const userDOB = documentResponseData?.person?.dateOfBirth?.value ?? null;

  await AsyncStorage.setItem("userDOB", userDOB);

  if (uploadDocVcResponse !== null) {
    await AsyncStorage.setItem("uploadedDocVc", JSON.stringify(uploadDocVcResponse));
  }

  if (userDetails.responseData) {
    console.log('Uploading doc after registration');
  } else {
    await AsyncStorage.setItem("flow", "documentflow");
  }
};

const ssiBaseUrl = "https://ssi-test.myearth.id/api"
const authorizationKey = "01a41742-aa8e-4dd6-8c71-d577ac7d463c"

//createDOc VC
const createUploadDocVc = async (fieldsObject: any) => {
  try {
      //const signature = await createUserIdSignature(profileData);
      const data = {
          schemaName: 'UploadedDocVCNeww:1',
          isEncrypted: false,
          dependantVerifiableCredential: [],
          credentialSubject: {
            "gender": fieldsObject.gender !== undefined ? fieldsObject.gender : null,
            "idNumber": fieldsObject.idNumber !== undefined ? fieldsObject.idNumber : null,
            "lastName": fieldsObject.lastName !== undefined ? fieldsObject.lastName : null,
            "firstName": fieldsObject.firstName !== undefined ? fieldsObject.firstName : null,
            "citizenship": fieldsObject.citizenship !== undefined ? fieldsObject.citizenship : null,
            "dateOfBirth": fieldsObject.dateOfBirth !== undefined ? fieldsObject.dateOfBirth : null,
           // "nationality": fieldsObject.nationality !== undefined ? fieldsObject.nationality : null,
           // "yearOfBirth": fieldsObject.yearOfBirth !== undefined ? fieldsObject.yearOfBirth : null,
            "placeOfBirth": fieldsObject.placeOfBirth !== undefined ? fieldsObject.placeOfBirth : null,
           // "pepSanctionMatch": fieldsObject.pepSanctionMatch !== undefined ? fieldsObject.pepSanctionMatch : null,
            "occupation": fieldsObject.occupation !== undefined ? fieldsObject.occupation : null,
            "employer": fieldsObject.employer !== undefined ? fieldsObject.employer : null,
           // "foreginerStatus": fieldsObject.foreginerStatus !== undefined ? fieldsObject.foreginerStatus : null,
           // "extraNames": fieldsObject.extraNames !== undefined ? fieldsObject.extraNames : null,
            "address": fieldsObject.addresses !== undefined ? fieldsObject.addresses : null,
            "type": fieldsObject.type !== undefined ? fieldsObject.type : null,
            "number": fieldsObject.number !== undefined ? fieldsObject.number : null,
            "country": fieldsObject.country !== undefined ? fieldsObject.country : null,
            "validFrom": fieldsObject.validFrom !== undefined ? fieldsObject.validFrom : null,
            "validUntil": fieldsObject.validUntil !== undefined ? fieldsObject.validUntil : null,
          //  "placeOfIssue": fieldsObject.placeOfIssue !== undefined ? fieldsObject.placeOfIssue : null,
          //  "firstIssue": fieldsObject.firstIssue !== undefined ? fieldsObject.firstIssue : null,
           // "issueNumber": fieldsObject.issueNumber !== undefined ? fieldsObject.issueNumber : null,
            "issuedBy": fieldsObject.issuedBy !== undefined ? fieldsObject.issuedBy : null,
           // "nfcValidated": fieldsObject.nfcValidated !== undefined ? fieldsObject.nfcValidated : null,
           // "residencePermitType": fieldsObject.residencePermitType !== undefined ? fieldsObject.residencePermitType : null
          }
      };

      const config = {
          method: 'post',
          url: `${ssiBaseUrl}/issuer/verifiableCredential?isCryptograph=false&downloadCryptograph=false`,
          headers: {
              'X-API-KEY': authorizationKey,
              did: keys.responseData.newUserDid,
              publicKey: keys.responseData.generateKeyPair.publicKey,
              'Content-Type': 'application/json',
          },
          data: JSON.stringify(data),
      };
console.log('DocVcApi', config)
      const response = await axios.request(config);
      console.log('VC response', response.data.data.verifiableCredential)
      //const verifiableCredential = response.data.data.verifiableCredential;
    
      return response.data.data.verifiableCredential;

  } catch (error) {
      console.log(error);
      throw error;
  }
};


  const verifiAPICall =()=>{
    const apiUrl = 'https://apitest.myearth.id/user/liveness';
const selfieBase64 = base64Icon; // Replace with your actual base64-encoded selfie data

const docPhotoUrl = 'https://prod.idscan.cloud/IDScanEnterpriseSvc/Journey/GetImage?id=0dfb14df-f0fd-485b-a1cc-b80742865ebe&role=OutputWhiteImage';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const formData = new FormData();
formData.append('selfieBase64', selfieBase64);
formData.append('docPhotoUrl', docPhotoUrl);

fetch(apiUrl, {
  method: 'POST',
  headers: headers,
  body: formData,
})
  .then((response: { json: () => any; }) => response.json())
  .then((data: any) => {
    // Handle the response data
    console.log(data);
  })
  .catch((error: any) => {
    // Handle errors
    console.error('Error:', error);
  });

  }

  const validateImages = async () => {
    SetDis(true);
    setLoad(true);

    try{
      const payLoad = {
        eventValue: selectedDocument,
        eventType: "ID_VERIFICATION",
        userId: userDetails?.responseData?.Id,
        publicKey: userDetails?.responseData?.publicKey,
      };
  
      //console.log('userDetails', userDetails.responseData, 'UserDID', keys.responseData)
  
      // type ExtractedField = {
      //   LocalValue: string;
      //   Name: string;
      //   OCRLocalValue: string;
      //   OCRValue: string;
      //   Value: string;
      // };
      
      // // Define the type of the ProcessedDocument object
      // type ProcessedDocument = {
      //   ExtractedFields: ExtractedField[];
      //   // Add other properties if needed
      // };
      
      // // Define the type of the uploadDocResponseData object
      // type UploadDocResponseData = {
      //   ProcessedDocuments: ProcessedDocument[];
      //   // Add other properties if needed
      // };
  
  
      let docImage64
      if(pic && pic.uri){
        docImage64 = await getBase64FromImageURI(pic.uri)
        
      }else if(selectedItem.base64){
        docImage64 = selectedItem.base64
      }else(
        docImage64 = uploadedDocuments.base64
      )
      let docBack64
    if(fileUriBack){
  docBack64 = await getBase64FromImageURI(fileUriBack.uri)
    }
      const faceImage64 = faceImageData?.base64
  
      const prefix = 'data:image/jpeg;base64,';
  
  const prefixedDocImage64 = prefix + docImage64;
  const prefixedFaceImage64 = prefix + faceImage64;
  const prefixedBackImage64 = prefix + docBack64;
  
      console.log('DocImagebase64######################:', prefixedDocImage64.substring(0, 100) + '...');
  console.log('SelfieImagebase64######################:', prefixedFaceImage64.substring(0, 50) + '...');
  console.log('DocBackImage64##########################:', prefixedBackImage64.substring(0, 50) + '...')
  
  
      console.log('Sending details to the api1')
   // const uploadDocResponseData =  await sendImagesToAPIGBG()
 const createSession = await createVerification()
 console.log('sessionID:', createSession)
   let sessionId
  //const sessionId = "c16426cf-3e2e-4a43-966d-246f35815016"
    let uploadDocResponseData
  //if(createSession.status=="success"){
  if (createSession.status=="success"){
  sessionId = createSession.verification.id
  
  const uploadDocFront = await uploadImage(prefixedDocImage64, "document-front", sessionId)
  console.log('FrontUploaded!', uploadDocFront)
      if(uploadDocFront.status=="success"){
        const uploadDocBack = await uploadImage(prefixedBackImage64, "document-back", sessionId)
  console.log('BackUploaded!', uploadDocBack)
        if(uploadDocBack.status=="success"){
          const uploadSelfie = await uploadImage(prefixedFaceImage64, "face", sessionId)
          console.log('SelfieUploaded!', uploadSelfie)
          if(uploadSelfie.status=="success"){
  
            const submitSession = await updateVerificationStatus(sessionId)
            
            console.log('Session submitted!', submitSession)
            if(submitSession.status=="success"){
              await new Promise(resolve => setTimeout(resolve, 2000));
                uploadDocResponseData = await getSessionDecision(sessionId);
             
             const getDocImages = await getMediaData(sessionId);
             console.log("Document Images", getDocImages)
            }else{
              console.log("Didn't recieve uploaded doc data")
              seterrorResponse(true)
              throw new Error('An error occurred during image validation');
            }
          }else{
          console.log("User selfie not uploaded try again")
          seterrorResponse(true)
          throw new Error('An error occurred during image validation');
        }
        }else{
          console.log("Document back not uploaded try again")
          seterrorResponse(true)
          throw new Error('An error occurred during image validation');
        }
      }else{
        console.log("Document front not uploaded try again")
        seterrorResponse(true)
        throw new Error('An error occurred during image validation');
      }
  }else{
    console.log('Session not created')
    seterrorResponse(true)
    throw new Error('An error occurred during image validation');
  }
    // const fieldsObject: Record<string, string> = {};
  
    // // Iterate through the extractedFields array
    // uploadDocResponseData.ProcessedDocuments[0].ExtractedFields.forEach((field: ExtractedField) => {
    //   // Check if the field has both "Name" and "OCRValue" properties
    //   if (field.Name && field.OCRValue) {
    //     // Add the "Name" and "OCRValue" fields to the fieldsObject
    //     fieldsObject[field.Name] = field.OCRValue;
    //   }
    // });
  //   const sessionId = '792505d8-f07d-40a7-98ed-026c5c6fe008'
  //  const uploadDocResponseData = await getSessionDecision(sessionId)
  //   // console.log('NewExtracted Fields',fieldsObject);
  //   if(!uploadDocResponseData){
  //     setLoad(false)
      
  //   }
  
    //uploadDocResponseData = await getSessionDecision(sessionId);
  
  
  console.log("UploadDocData:", uploadDocResponseData)
    
  // Extracting data from the person object
  const personData: { [key: string]: string } = {};
  for (const key in uploadDocResponseData.person) {
    if (typeof uploadDocResponseData.person[key]?.value === "string") {
      personData[key] = uploadDocResponseData.person[key].value;
    }
  }
  
  // Extracting data from the document object
  const documentData: { [key: string]: string } = {};
  for (const key in uploadDocResponseData.document) {
    if (typeof uploadDocResponseData.document[key]?.value === "string") {
      documentData[key] = uploadDocResponseData.document[key].value;
    }
  }
  
  // Combining the extracted data into one object
  const combinedData = {
    ...personData,
    ...documentData
  };
  
  // Logging the combined data
  console.log("Combined Data:", combinedData);
  
    if(keys.responseData){
      console.log('Sending details to the api2')
      const uploadDocVcResponse = await createUploadDocVc(combinedData)
      await createPayLoadFromDocumentData(uploadDocResponseData, uploadDocVcResponse)
     
    }else{
      await createPayLoadFromDocumentData(uploadDocResponseData, null )
    }
   
    
     
     // verifiAPICall()
  
      setTimeout(() => {
        const index = documentsDetailsList?.responseData?.findIndex(
          (obj: { id: any; }) => obj?.id === selectedItem?.id
        );
        console.log("index", index);
        if (selectedItem) {
          console.log("indexData", "index1");
          setsuccessResponse(true);
  
          const obj = documentsDetailsList?.responseData[index];
          obj.documentName = selectedDocument;
          obj.categoryType =
            selectedDocument && selectedDocument?.split("(")[0]?.trim();
          dispatch(
            updateDocuments(documentsDetailsList?.responseData, index, obj)
          );
          setTimeout(async () => {
            setsuccessResponse(false);
            const item = await AsyncStorage.getItem("flow");
            if (userDetails.responseData) {
              //props.navigation.navigate("Documents");
            } else {
              // generateVc()
              props.navigation.navigate("RegisterScreen");
              
            }
          }, 2000);
        } else {
          console.log("indexData", "index2");
  
          var date = dateTime();
          const filePath = RNFetchBlob.fs.dirs.DocumentDir + "/" + "Adhaar";
          var documentDetails: IDocumentProps = {
            id: `ID_VERIFICATION${Math.random()}${selectedDocument}${Math.random()}`,
            // name: selectedDocument,
            documentName: selectedDocument,
            path: filePath,
            date: date?.date,
            time: date?.time,
            txId: data?.result,
            docType: "jpg",
            docExt: ".jpg",
            processedDoc: "",
            base64: uploadedDocumentsBase64,
            categoryType: selectedDocument && selectedDocument?.split("(")[0]?.trim(),
            docName: docname,
            isVerifyNeeded: true,
            isLivenessImage: "livenessImage",
            name: "",
            vc: undefined,
            isVc: false,
            signature: undefined,
            typePDF: undefined,
            verifiableCredential: undefined
          };
  
          var DocumentList = documentsDetailsList?.responseData
            ? documentsDetailsList?.responseData
            : [];
          var documentDetails1: IDocumentProps = {
            id: `ID_VERIFICATION${Math.random()}${"selectedDocument"}${Math.random()}`,
            name: "Proof of age",
            path: "filePath",
            documentName: "Proof of age",
            categoryType: "ID",
            date: date?.date,
            time: date?.time,
            txId: "data?.result",
            docType: verifyVcCred?.type[1],
            docExt: ".jpg",
            processedDoc: "",
            isVc: true,
            vc: JSON.stringify({
              name: "Proof of age",
              documentName: "Acknowledgement Token",
              path: "filePath",
              date: date?.date,
              time: date?.time,
              txId: "data?.result",
              docType: "pdf",
              docExt: ".jpg",
              processedDoc: "",
              isVc: true,
            }),
            verifiableCredential: verifyVcCred,
            docName: "",
            base64: undefined,
            isLivenessImage: "",
            signature: undefined,
            typePDF: undefined
          };
  
          var DocumentList = documentsDetailsList?.responseData
            ? documentsDetailsList?.responseData
            : [];
          DocumentList.push(documentDetails);
         DocumentList.push(documentDetails1);
          dispatch(saveDocuments(DocumentList));
          setsuccessResponse(true);
          getHistoryReducer.isSuccess = false;
          setTimeout(async () => {
            setsuccessResponse(false);
            const item = await AsyncStorage.getItem("flow");
            if (userDetails.responseData) {
              props.navigation.navigate("Documents");
            } else {
              // generateVc()
              props.navigation.navigate("RegisterScreen");
              
            }
          }, 2000);
        }
      }, 200);
      setLoad(false);
    }
    catch (error) {
    console.error('Error during image validation:', error);
    seterrorResponse(true); // Set errorResponse state to true to display error popup
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (userDetails.responseData) {
      props.navigation.navigate("Documents");
    } else {
      // generateVc()
      props.navigation.navigate("UploadDocument");
      
    }
  } finally {
    setLoad(false); // Ensure loader is hidden
  }
   
  };

  function generateVc() {
    var date = dateTime();
    var documentDetails: IDocumentProps = {
      id: `ID_VERIFICATION${Math.random()}${"selectedDocument"}${Math.random()}`,
      name: "Acknowledgement Token",
      path: "filePath",
      date: date?.date,
      time: date?.time,
      txId: "data?.result",
      docType: verifyVcCred?.type[1],
      docExt: ".jpg",
      processedDoc: "",
      isVc: true,
      vc: JSON.stringify({
        name: "Acknowledgement Token",
        documentName: "Acknowledgement Token",
        path: "filePath",
        date: date?.date,
        time: date?.time,
        txId: "data?.result",
        docType: "pdf",
        docExt: ".jpg",
        processedDoc: "",
        isVc: true,
      }),
      verifiableCredential: verifyVcCred,
      documentName: "",
      docName: "",
      base64: undefined,
      isLivenessImage: "",
      signature: undefined,
      typePDF: undefined
    };

    var DocumentList = documentsDetailsList?.responseData
      ? documentsDetailsList?.responseData
      : [];

    DocumentList.push(documentDetails);
    dispatch(saveDocuments(DocumentList));
  }

  if (getHistoryReducer?.isSuccess) {
    setsuccessResponse(true);
    getHistoryReducer.isSuccess = false;
    setTimeout(() => {
      setsuccessResponse(false);
      props.navigation.navigate("Documents");
    }, 2000);
  }

  const navBack = () => {
    props.navigation.goBack();
    setLoad(false);
  };

  useEffect(() => {
    console.log("picLOG", docname);
  });

  // useEffect(()=>{
  //   getItem()
  //   },[])

  //   const getItem=async()=>{
  //     const item =await  AsyncStorage.getItem("editDoc");
  //     if(item=='editDoc'){
  //       name =await  AsyncStorage.getItem("userDetails");

  //     }
  //   }
  //console.log("selectedItem?.base64 ", selectedItem);
  return (
    <View style={styles.sectionContainer}>
      <Header
        isLogoAlone={true}
        linearStyle={styles.linearStyle}
        containerStyle={{
          iconStyle: {
            width: 150,
            height: 80,
            marginTop: 0,
          },
          iconContainer: styles.alignCenter,
        }}
      ></Header>
      {/* <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View> */}

      <GenericText
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: 20,
          alignSelf: "center",
          marginTop: 15,
        }}
      >
        {"livetest"}
      </GenericText>

      <View style={styles.dashedLine}>
        {selectedItem && selectedItem?.base64 ? (
          <Image
            resizeMode={"contain"}
            style={{
              width: 330,
              height: "100%",
            }}
            source={{
              uri: selectedItem?.base64,
            }}
          ></Image>
        ) : (
          <Image
            resizeMode={"contain"}
            style={{
              width: 330,
              height: "100%",
            }}
            source={{
              uri: pic ? pic.uri : uploadedDocumentsBase64,
            }}
          ></Image>
        )}
      </View>

      <View style={styles.dashedLine}>
        <Image
          resizeMode={"contain"}
          style={{
            width: 330,
            height: "100%",
          }}
          source={{ uri: base64Icon }}
        ></Image>
      </View>

      <TouchableOpacity onPress={() => navBack()}>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Image
            source={LocalImages.cam}
            style={{
              width: 15,
              height: 15,
              alignSelf: "center",
              tintColor: Screens.colors.primary,
            }}
          />
          <GenericText
            style={[
              {
                fontSize: 13,
                color: Screens.colors.primary,
                fontWeight: "500",
                textDecorationLine: "underline",
                marginLeft: 6,
              },
            ]}
          >
            {"retakephoto"}
          </GenericText>
        </View>
      </TouchableOpacity>

      <View
        style={{
          flex: 0.17,
          flexDirection: "row",
          paddingHorizontal: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={validateImages}
          disabled={dis ? true : false}
          style={{
            elevation: 5,
            margin: 20,
            width: 300,
            height: 50,
            borderRadius: 50,
            backgroundColor: Screens.colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GenericText style={{ color: "#fff" }}>{"submt"}</GenericText>
        </TouchableOpacity>

        <AnimatedLoader
        isLoaderVisible={load}
        loadingText={"verifying"}
      />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"verificationsuccess"}
      />

<ErrorPopUp // Error popup component
  isLoaderVisible={errorResponse}
  loadingText={"An error occurred. Please try again."}
/>
      </View>

      <AnimatedLoader
        isLoaderVisible={load || getHistoryReducer?.isLoading}
        loadingText={"verifying"}
      />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"verificationsuccess"}
      />

<ErrorPopUp // Error popup component
  isLoaderVisible={errorResponse}
  loadingText={"An error occurred. Please try again."}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: Screens.pureWhite,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedLine: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    flex: 0.4,

    marginHorizontal: 20,
    marginVertical: 20,
  },
  linearStyle: {
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  logoContainer: {
    width: 15,
    height: 15,
    tintColor: "#fff",
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
});

export default VerifiDocumentScreen;
