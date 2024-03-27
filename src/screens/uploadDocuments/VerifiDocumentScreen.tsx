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
  console.log(
    "Username",
    documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
      (item: any) => item.Name === "FullName"
    )[0]
  );
  const username =
    documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
      (item: any) => item.Name === "FullName"
    )[0]?.Value;
    
 
  
  const  userDOB =
    documentResponseData?.ProcessedDocuments[0].ExtractedFields?.filter(
      (item: any) => item.Name === "BirthDate"
    )[0]?.Value;
 
    const userDOBValue = userDOB !== undefined ? userDOB : null;
console.log(userDOBValue)
  // await AsyncStorage.setItem("userDetails", username.toString());
  // await AsyncStorage.setItem("userDetails", userDOB.toString());
  await AsyncStorage.setItem("userDOB", userDOBValue);
  if(uploadDocVcResponse!==null){
    await AsyncStorage.setItem("uploadedDocVc", JSON.stringify({ uploadDocVcResponse }));
  }

  if(userDetails.responseData){
console.log('Uploading doc after registeration')
  }else{
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
          schemaName: 'UploadedDocVC:1',
          isEncrypted: false,
          dependantVerifiableCredential: [],
          credentialSubject: {
            documentExtractedData: fieldsObject
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
    const apiUrl = 'https://stage-apiv2.myearth.id/user/liveness';
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
    const payLoad = {
      eventValue: selectedDocument,
      eventType: "ID_VERIFICATION",
      userId: userDetails?.responseData?.Id,
      publicKey: userDetails?.responseData?.publicKey,
    };

    //console.log('userDetails', userDetails.responseData, 'UserDID', keys.responseData)

    type ExtractedField = {
      LocalValue: string;
      Name: string;
      OCRLocalValue: string;
      OCRValue: string;
      Value: string;
    };
    
    // Define the type of the ProcessedDocument object
    type ProcessedDocument = {
      ExtractedFields: ExtractedField[];
      // Add other properties if needed
    };
    
    // Define the type of the uploadDocResponseData object
    type UploadDocResponseData = {
      ProcessedDocuments: ProcessedDocument[];
      // Add other properties if needed
    };


    console.log('Sending details to the api1')
  const uploadDocResponseData =  await sendImagesToAPIGBG()


  
  const fieldsObject: Record<string, string> = {};

  // Iterate through the extractedFields array
  uploadDocResponseData.ProcessedDocuments[0].ExtractedFields.forEach((field: ExtractedField) => {
    // Check if the field has both "Name" and "OCRValue" properties
    if (field.Name && field.OCRValue) {
      // Add the "Name" and "OCRValue" fields to the fieldsObject
      fieldsObject[field.Name] = field.OCRValue;
    }
  });
  
  console.log('NewExtracted Fields',fieldsObject);

  
  if(keys.responseData){
    console.log('Sending details to the api2')
    const uploadDocVcResponse = await createUploadDocVc(fieldsObject)
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
      </View>

      <AnimatedLoader
        isLoaderVisible={loading || getHistoryReducer?.isLoading}
        loadingText={"verifying"}
      />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"verificationsuccess"}
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
