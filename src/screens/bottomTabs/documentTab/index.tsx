import { useIsFocused } from "@react-navigation/native";
import { values } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Share from "react-native-share";
import Avatar from "../../../components/Avatar";
import BottomSheet from "../../../components/Bottomsheet";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import GenericText from "../../../components/Text";
import TextInput from "../../../components/TextInput";
import { LocalImages } from "../../../constants/imageUrlConstants";
import { SCREENS } from "../../../constants/Labels";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { saveDocuments, updateDocuments } from "../../../redux/actions/authenticationAction";
import { Screens } from "../../../themes";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-image";
import { getColor } from "../../../utils/CommonFuntion";
import zlib from "zlib";
import Spinner from "react-native-loading-spinner-overlay/lib";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import AWS from "aws-sdk";
import axios from "axios";

import VeriffSdk from '@veriff/react-native-sdk';
import { createVerification, getMediaData, getMediaImage, getSessionDecision } from "../../../utils/veriffApis";
import { dateTime } from "../../../utils/encryption";
import { IDocumentProps } from "../../uploadDocuments/VerifiDocumentScreen";
import RNFetchBlob from "rn-fetch-blob";
import AnimatedLoader from "../../../components/Loader/AnimatedLoader";
import SuccessPopUp from "../../../components/Loader";
import ErrorPopUp from "../../../components/Loader/errorPopup";

const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
const earthIDLogo = require('../../../../resources/images/earthidLogoBlack.png');

interface IDocumentScreenProps {
  navigation?: any;
  route?: any;
}

const DocumentScreen = ({ navigation, route }: IDocumentScreenProps) => {
  const _toggleDrawer = () => {
    navigation.openDrawer();
  };
  const isFoused = useIsFocused();
  let documentsDetailsListData = useAppSelector((state) => state.Documents);
  const [documentsDetailsList, setdocumentsDetailsList] = useState(
    documentsDetailsListData
  );
  console.log('documentsDetailsListData===>',documentsDetailsListData)
  const [selectedDocuments, setselectedDocuments] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  let [qrBase64, setBase64] = useState("");

  const [activityLoader, setActivityLoad] = useState(false);
  const getHistoryReducer = useAppSelector((state) => state.getHistoryReducer);
  console.log("getHistoryReducer===>", getHistoryReducer);

  let categoryTypes = "";

  if (route?.params && route?.params?.category) {
    categoryTypes = route?.params?.category;
  }
  const dispatch = useAppDispatch();
  const [selectedItem, setselectedItem] = useState<any>();
  const [edit, setEdit] = useState();
  const [itemdata, setitemdata] = useState([]);
  const [data, setData] = useState(documentsDetailsList?.responseData);
  const [multiSelectionEnabled, setMultiSelectionEnabled] = useState(false);
  const [clearMultiselection, setClearMultiSelection] = useState(false);
  const [
    isBottomSheetForSideOptionVisible,
    setisBottomSheetForSideOptionVisible,
  ] = useState<boolean>(false);
  const [multpleDocuments, setMultipleDucuments] = useState({
    isSelected: false,
  });
  const [searchedData, setSearchedData] = useState([]);
  const [signedUrl, setPreSignedUrl] = useState(undefined);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [isCheckBoxEnable, setCheckBoxEnable] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [loading, setloading] = useState(false);
  const [load, setLoad] = useState(false);
  const [successResponse, setsuccessResponse] = useState(false);
  const [errorResponse, seterrorResponse] = useState(false);

  const userDetails = useAppSelector((state) => state.account);
  const keys = useAppSelector((state) => state.user);

  const bucketName: any = userDetails?.responseUserSpecificBucket;
  // const base64Image: any = selectedItem?.base64;
  const imageName: any = selectedItem?.docName + "." + selectedItem?.docType;

  // useEffect(() => {
  //   console.log("DOCUMENTS=====>>>>>>>>>>>", route?.params?.category);
  //   const chek = route?.params?.category;
  //   chek === undefined ? console.log("All posts") : console.log("filtrd");
  // }, [route?.params?.category]);

  const [isBottomSheetForFilterVisible, setisBottomSheetForFilterVisible] =
    useState<boolean>(false);
  const [isBottomSheetForShare, setIsBottomSheetForShare] =
    useState<boolean>(false);
  const _rightIconOnPress = (selecteArrayItem: any) => {
    setselectedDocuments(selecteArrayItem);
    setselectedItem(selecteArrayItem);
    setisBottomSheetForSideOptionVisible(true);
  };
  const _shareIconPress = (selecteArrayItem: any) => {
    setselectedItem(selecteArrayItem);
    setisBottomSheetForSideOptionVisible(true);
  };
  // useEffect(() => {
  //   deleteAllBuckets();
  // }, []);
  const getCategoryImages = (item: { categoryType: any; name: any }) => {
    const getItems = SCREENS.HOMESCREEN.categoryList.filter(
      (itemFiltered, index) => {
        return (
          itemFiltered?.TITLE?.toLowerCase() ===
          item?.categoryType?.toLowerCase()
        );
      }
    );

    if (!getItems[0]) {
      return "#D7EFFB";
    }
    return getItems[0];
  };
  const getImagesColor = (item: any) => {
    let colors = item?.documentName;
    let iteName = colors?.trim()?.split("(")[0]?.trim();
    return getColor(iteName);
  };
  useEffect(() => {
    setdocumentsDetailsList(documentsDetailsListData);
  }, [documentsDetailsListData?.responseData]);

  const multiSelect = (item: any) => {
    // console.log(item?.base64, "@@@@@@@@@");
    // setMultipleDucuments(item);
    setCheckBoxEnable(!isCheckBoxEnable);
  };
  const _selectTigger = (item: any) => {
    item.isSelected = !item.isSelected;
    setselectedDocuments(item);
    setdocumentsDetailsList({ ...documentsDetailsList });
  };
  function convertTimeToAmPmFormat(timeString: {
    split: (arg0: string) => [any, any];
  }) {
    const [hours, minutes] = timeString.split(":");
    let formattedTime = "";

    // Convert the 24-hour format to 12-hour format
    let hoursIn12HourFormat = parseInt(hours, 10) % 12;
    if (hoursIn12HourFormat === 0) {
      hoursIn12HourFormat = 12; // Set 12 for 0 (midnight) in 12-hour format
    }

    // Determine AM or PM
    const amOrPm = parseInt(hours, 10) < 12 ? "am" : "pm";

    // Add leading zero for single-digit minutes
    const paddedMinutes = minutes.padStart(2, "0");

    // Construct the formatted time string
    formattedTime = `${hoursIn12HourFormat}:${paddedMinutes} ${amOrPm}`;

    return formattedTime;
  }
  const getTime = (item: { time: any }) => {
    return convertTimeToAmPmFormat(item?.time);
  };
  function compareTime(a: { time: any; }, b: { time: any; }) {
    const timeA = new Date(`1970-01-01T${a.time}`);
    const timeB = new Date(`1970-01-01T${b.time}`);
    return timeA - timeB;
  }



  const _renderItem = ({ item, index }: any) => {
   
    return (
      <TouchableOpacity
        onLongPress={() => {
          multiSelect(item);
        }}
        style={{
          marginBottom: 20,
        }}
        onPress={
          isCheckBoxEnable
            ? () => _selectTigger(item)
            : () =>
                navigation.navigate("ViewCredential", { documentDetails: item })
        }
      >
      

        <View style={{ marginTop: -20 }}>
          <Card
            titleIcon={item?.isVc ? LocalImages.vcImage : null}
            leftAvatar={LocalImages.documentsImage}
            absoluteCircleInnerImage={LocalImages.upImage}
            rightIconSrc={  item?.isVc?null: LocalImages.menuImage}
            rightIconOnPress={() => _rightIconOnPress(item)}
            title={
              item?.isVc
                ? item.name
                : item?.docName?.split("(")[1]?.split(")")[0] == "undefined"
                ? item?.docName?.replaceAll("%20", "")
                : item?.docName?.replaceAll("%20", "")
            }
            subtitle={
              item.isVc
                ? `      Received  : ${item.date}`
                : `      Uploaded  : ${item.date}`
            }
            timeTitle={"   " + `${getTime(item)}`}
            isCheckBoxEnable={isCheckBoxEnable}
            onCheckBoxValueChange={(value: any) => {
              // item.isSelected = value;
              //setdocumentsDetailsList({ ...documentsDetailsList });
            }}
            checkBoxValue={item.isSelected}
            style={{
              ...styles.cardContainer,
              ...{
                avatarContainer: {
                  backgroundColor: getCategoryImages(item)?.COLOR,
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  marginTop: 25,
                  marginLeft: 10,
                  marginRight: 5,
                },
                uploadImageStyle: {
                  backgroundColor: getCategoryImages(item)?.COLOR,
                  borderRadius: 25,
                  borderWidth: 3,
                  bordercolor: "#fff",
                  borderWidthRadius: 25,
                },
              },
              title: {
                fontSize: 18,
                marginTop: -10,
                fontWeight: "bold",
              },
              subtitle: {
                fontSize: 14,
                marginTop: 5,
                marginLeft: -23
              },
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  //AWS3 bucket image store

  const handleUploadImage = async () => {
    setisBottomSheetForSideOptionVisible(false);
   navigation.navigate("ShareQr", { selectedItem: selectedItem });
  };

  const RowOption = ({ icon, title, rowAction }: any) => (
    <TouchableOpacity onPress={rowAction}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {icon && (
          <Image
            resizeMode="contain"
            style={styles.logoContainer}
            source={icon}
          ></Image>
        )}

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <GenericText
            style={[
              styles.categoryHeaderText,
              { fontSize: 13, marginHorizontal: 10, marginVertical: 15 },
            ]}
          >
            {title}
          </GenericText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onChangeHandler = (text: any) => {
    // docName to documentName
    const newDataItem = documentsDetailsList?.responseData || [];
    const filteredData = newDataItem.filter(
      (item: { docName: string; documentName: string; categoryType: string }) =>
        item.docName?.toLowerCase()?.includes(text?.toLowerCase()) ||
        item.documentName?.toLowerCase()?.includes(text?.toLowerCase()) ||
        item.categoryType?.toLowerCase()?.includes(text?.toLowerCase())
    );
    setsearchText(text);

    setSearchedData(filteredData);

    // if (text) {
    //   // Inserted text is not blank
    //   // Filter the masterDataSource
    //   // Update FilteredDataSource
    //   if(documentsDetailsList?.responseData==undefined){

    //     setSearchedData(data);
    //     setsearchText(text);
    //   }else{

    //     const newData = documentsDetailsList?.responseData.filter(
    //       function (item:any) {
    //         const itemData = item.documentName ? item?.documentName.toUpperCase() : "".toUpperCase();
    //         const textData = text.toUpperCase();
    //         return itemData.indexOf(textData) > -1;
    //     });
    //     setsearchText(text);

    //     setSearchedData(newData);
    //   }
    // } else {
    //   // Inserted text is blank
    //   // Update FilteredDataSource with masterDataSource
    //   setSearchedData(itemdata);
    //   setsearchText(text);

    // }
  };

  const shareItem = async () => {
    if (selectedDocuments?.isVc) {
      await Share.open({
        message: selectedItem?.vc,
        title: "Token",
      });
    } else {
      if (selectedItem?.isLivenessImage === "livenessImage") {
        await Share.open({
          url: selectedItem?.base64,
        });
      } else if (selectedItem?.type === "deeplink") {
        await Share.open({
          url: selectedItem?.base64,
        });
      } else if (selectedItem?.docType === "jpg") {
        await Share.open({
          url: `data:image/jpeg;base64,${selectedItem?.base64}`,
        });
      } else {
        await Share.open({
          url: `data:image/png;base64,${selectedItem?.base64}`,
        });
      }
    }
  };

  const qrCodeModal = () => {
    handleUploadImage();
  };

  const shareMultipleItem = async () => {
    let temp = [];
    temp = documentsDetailsList?.responseData.filter((el: { isSelected: boolean; }) => {
      // console.log(i[0].isSelected,'IIII')
      return el.isSelected == true;
    });
    console.log(temp, "IIII");
    let ShareBase64Array: string[] = [];
    temp.map(async (item: any, index: number) => {
      if (item?.docType === "jpg") {
        ShareBase64Array.push(`data:image/jpg;base64,${item?.base64}`);
      } else {
        ShareBase64Array.push(`data:application/pdf;base64,${item?.base64}`);
      }
    });
    setTimeout(async () => {
      await Share.open({
        urls: ShareBase64Array,
      });
    }, 1000);
  };

  const deleteItem = () => {
    console.log("selectedItem?.id", selectedItem);
    Alert.alert(
      "Confirmation! ",
      "Are you sure you want to delete this document ?",
      [
        {
          text: "Cancel",
          onPress: () => (
            console.log("Cancel Pressed!"),
            setisBottomSheetForSideOptionVisible(false)
          ),
        },
        {
          text: "OK",
          onPress: () => {
            setisBottomSheetForSideOptionVisible(false);
            const imageName: any =
              selectedItem?.docName + "." + selectedItem?.docType;
            const key = `images/${imageName}`;
            var s3 = new AWS.S3();
            var params = { Bucket: bucketName, Key: key };

            s3.deleteObject(params, function (err, data) {
              if (err) console.log(err, err.stack); // error
              else console.log(); // deleted
            });
            const helpArra = [...documentsDetailsList?.responseData];
            const findIndex = helpArra?.findIndex(
              (item) => item.id === selectedItem?.id
            );
            findIndex >= -1 && helpArra?.splice(findIndex, 1);
            // console.log('helpArra',helpArra)
            dispatch(saveDocuments(helpArra));
          },
        },
      ],
      { cancelable: false }
    );
  };

  function editItem() {
    setisBottomSheetForSideOptionVisible(false);
    navigation.navigate("categoryScreen", {
      selectedItem: selectedItem,
      editDoc: "editDoc",
      itemData: edit,
      itemVerify: selectedItem?.isLivenessImage,
    });
    // var data : any =selectedItem
    // await AsyncStorage.setItem("userDetails", data);
    // await AsyncStorage.setItem("editDoc", "editDoc");
  }

  const onPressNavigateTo = async () => {

    await alertUploadDoc()

      }


      const alertUploadDoc = async () => {
      
     
        Alert.alert(
          "Please select the type of document you wish to add:",
    
    "For a government-issued photo ID, click 'Photo ID.'\n\n" +
    "For a self-attested document, click 'Self-attested.'",
          [
            {
              text: "Self-attested",
              onPress: () => {
                navigation.navigate("uploadDocumentsScreen");
              },
              style: "cancel",
            },
            {
              text: "Photo ID",
              onPress: () => {
     

   console.log("Document Data-----------------------------------")
  veriffSdkLaunch()
                
              },
            },
          ],
          { cancelable: true }
        );
      }


      const veriffSdkLaunch = async () => {

            const sessionRes = await createVerification()
            const sessionUrl = sessionRes.verification.url
            const sessionId = sessionRes.verification.id
        
            
        
            var result = await VeriffSdk.launchVeriff({
              sessionUrl: sessionUrl,
              branding: {
                logo: resolveAssetSource(earthIDLogo), // see alternative options for logo below
                //background: '#fffff',
                //onBackground: '#ffffff',
               // onBackgroundSecondary: '#000',
               // onBackgroundTertiary: '#000000',
                primary: '#293fee',
                onPrimary: '#ffffff',
                secondary: '#00bbf9',
                onSecondary: '#ffffff',
                outline: '#444444',
                cameraOverlay: '#863ded',
                onCameraOverlay: '#ffffff',
                error: '#d90429',
                success: '#00bbf9',
                buttonRadius: 28,
                iOSFont: {
                  regular: 'Font-Regular',
                  medium: 'Font-Medium',
                  bold: 'Font-Bold',
                },
                androidFont: {
                  regular: 'font_regular',
                  medium: 'font-medium',
                  bold: 'font_bold',
                }
              },
            });
          
            setLoad(true);
        console.log('Response of sdk:', result )
        
        let uploadDocResponseData
        let getDocImages
        let getImage
        let uploadDocVcResponse
        
        if(result.status=="STATUS_DONE"){
        
          await new Promise(resolve => setTimeout(resolve, 8000));
        
            uploadDocResponseData = await getSessionDecision(sessionId);
            getDocImages = await getMediaData(sessionId);

            const documentFront = getDocImages.images.find(image => image.name === 'document-front-pre');
            console.log(documentFront);
            getImage = await getMediaImage(documentFront.id)
       
        
            console.log("Document Data", uploadDocResponseData)
          console.log("Document Images", getDocImages)
          console.log("Media Image", getImage)



       
        
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
         
        
             console.log('Sending details to the api2')
             uploadDocVcResponse = await createUploadDocVc(combinedData)
             console.log('UploadedDocVc is:::::::::::', uploadDocVcResponse)
             await createPayLoadFromDocumentData(uploadDocResponseData, uploadDocVcResponse)
        
      
        
      


        // const sessionId = "90c1146a-5f81-4c9a-8993-ad0675341a04";
        // const mediaId = "7b752371-0bba-48c1-b283-f50b5c8c4628";
        // const uploadDocResponseData = await getSessionDecision(sessionId);
        // const getDocImages = await getMediaData(sessionId);
        // const getImage = await getMediaImage(mediaId)
       
        
        //    console.log("Document Data", uploadDocResponseData)
        //  console.log("Document Images", getDocImages)
        //  console.log("Media Image", getImage)


        //  console.log("UploadDocData:", uploadDocResponseData)
    
        
            
           
        
         const username = uploadDocResponseData.person?.firstName?.value ?? null;
         
         const userDOB = uploadDocResponseData?.person?.dateOfBirth?.value ?? null;

         let ageProofVC
         if(userDOB!==null){
ageProofVC = await generateAgeProof(userDOB)
await AsyncStorage.setItem("ageProofVC", JSON.stringify(ageProofVC));
         }
        //  const docFrontBase64 = await urlToBase64(documentFront.url)
        //  console.log(docFrontBase64);
        
        const selectedDocument = "ID"
             // verifiAPICall()
          
             setTimeout(() => {
              // const index = documentsDetailsList?.responseData?.findIndex(
              //   (obj: { id: any; }) => obj?.id === selectedItem?.id
              // );
              // console.log("index", index);
              // if (selectedItem) {
              //   console.log("indexData", "index1");
              //   setsuccessResponse(true);
        
              //   const obj = documentsDetailsList?.responseData[index];
              //   obj.documentName = selectedDocument;
              //   obj.categoryType =
              //     selectedDocument && selectedDocument?.split("(")[0]?.trim();
              //   dispatch(
              //     updateDocuments(documentsDetailsList?.responseData, index, obj)
              //   );
              //   setTimeout(async () => {
              //     setsuccessResponse(false);
              //     const item = await AsyncStorage.getItem("flow");
              //     //const userDetails = await AsyncStorage.getItem("userDetails");
              //     if (userDetails.responseData) {
              //       //props.navigation.navigate("Documents");
              //     } else {
              //       // generateVc()
              //       navigation.navigate("RegisterScreen");
                    
              //     }
              //   }, 2000);
              // } else {
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
                  //txId: data?.result,
                  txId: sessionId,
                  docType: "jpg",
                  docExt: ".jpg",
                  processedDoc: "",
                  base64: getImage,
                  categoryType: selectedDocument && selectedDocument?.split("(")[0]?.trim(),
                  docName: "ID Document",
                  isVerifyNeeded: true,
                  isLivenessImage: null,
                  name: "",
                  vc: uploadDocVcResponse,
                  isVc: false,
                  signature: undefined,
                  typePDF: undefined,
                  verifiableCredential: uploadDocVcResponse
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
                  docType: ageProofVC?.type[1],
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
                  verifiableCredential: ageProofVC,
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
                  
                    // generateVc()
                   // navigation.navigate("RegisterScreen");
                    
                  
                }, 2000);
              //}
            }, 200);
            setLoad(false);
          }else{
            console.log("Didn't recieve uploaded doc data")
            seterrorResponse(true)
            throw new Error('An error occurred during image validation');
          }
        
          }
        
        
        
          const urlToBase64 = async (url: any) => {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Error converting URL to Base64:', error);
              throw error;
            }
          }
        
          const createPayLoadFromDocumentData = async (documentResponseData: any, uploadDocVcResponse: any) => {
            console.log("Username:", documentResponseData?.person?.firstName?.value);
            console.log("Date of Birth:", documentResponseData?.person?.dateOfBirth?.value);
          
            const username = documentResponseData?.person?.firstName?.value ?? null;
            const userDOB = documentResponseData?.person?.dateOfBirth?.value ?? null;
          
            await AsyncStorage.setItem("userDOB", userDOB);
            await AsyncStorage.setItem("userName", username);
            await AsyncStorage.setItem("uploadedDocReg", JSON.stringify(documentResponseData));
            //await AsyncStorage.setItem("flow", "documentflow");
          
      
              await AsyncStorage.setItem("uploadedDocVc", JSON.stringify(uploadDocVcResponse));
     
          
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


             //createAge VC
             const generateAgeProof = async (userDOB: any) => {
              try {

                  //const signature = await createUserIdSignature(profileData);
                  const data = {"schemaName": "UserAgeSchema:1",
                  "isEncrypted": true,
                  "dependantVerifiableCredential": [
                  ],
                  "credentialSubject": {
                    "earthId":userDetails?.responseData?.earthId,
                    "dateOfBirth": userDOB
                  }
                };
            
                  const config = {
                      method: 'post',
                      url: `${ssiBaseUrl}/issuer/verifiableCredential`,
                      headers: {
                          'X-API-KEY': authorizationKey,
                          did: keys.responseData.newUserDid,
                          publicKey: keys.responseData.generateKeyPair.publicKey,
                          'Content-Type': 'application/json',
                      },
                      data: JSON.stringify(data),
                  };
            console.log('AgeProofVC', config)
                  const response = await axios.request(config);
                  console.log('AgeProofVC response', response.data.data.verifiableCredential)
                  //const verifiableCredential = response.data.data.verifiableCredential;
                
                  return response.data.data.verifiableCredential;
            
              } catch (error) {
                  console.log(error);
                  throw error;
              }
            };
      

  const _keyExtractor = ({ path }: any) => path.toString();

  const getFilteredData = () => {
    console.log("getFilteredData");
    let data = documentsDetailsList?.responseData.sort(
      (a: { date: any }, b: { date: any }) => a.date - b.date
    );
    //  let data = documentsDetailsList?.responseData?.sort(compareTime);

    //

    if (categoryTypes !== "") {
      var alter = function (item: any) {
        let splittedValue = item?.categoryType
          ?.trim()
          .split("(")[0]
          ?.toLowerCase();

        return splittedValue?.trim() === categoryTypes?.trim()?.toLowerCase(); //use the argument here.
      };
      var filter = documentsDetailsList?.responseData?.filter(alter);
      return getItemsForSection(filter)
    }

    if (searchedData.length > 0) {
      getFilteredData;
      data = searchedData;
      return getItemsForSection(data)
    }

    if (searchedData.length === 0 && searchText != "") {
      return []; // earlier []
    }
    console.log('data',data)
  return getItemsForSection(data)
  };

  const getItemsForSection =(data: any[])=>{
    const idDocuments = data?.filter((item: { categoryType: string; })=>item?.categoryType === "ID" ||item?.categoryType === "id")
    const idHealthCare = data?.filter((item: { categoryType: string; })=>item?.categoryType === "HEALTHCARE" ||item?.categoryType === "Healthcare")
    const idTravels = data?.filter((item: { categoryType: string; })=>item?.categoryType === "TRAVEL" ||item?.categoryType === "Travel")
    const idInsurance = data?.filter((item: { categoryType: string; })=>item?.categoryType === "INSURANCE" ||item?.categoryType === "Insurance")
    const idEducation = data?.filter((item: { categoryType: string; })=>item?.categoryType === "EDUCATION" ||item?.categoryType === "Education")
    const idEmployement = data?.filter((item: { categoryType: string; })=>item?.categoryType === "EMPLOYMENT" ||item?.categoryType === "Employment")
    const idFinanace = data?.filter((item: { categoryType: string; })=>item?.categoryType === "FINANCE" ||item?.categoryType === "Finance")
    const localArray=[{
      title:idDocuments?.length>0 ? "ID":'',
      data:idDocuments
    },
    {
      title:idHealthCare?.length>0 ? "HEALTHCARE":'',
      data:idHealthCare
    },
    {
      title:idTravels?.length>0 ? "TRAVEL":'',
      data:idTravels
    },
    {
      title:idInsurance?.length>0 ? "INSURANCE":'',
      data:idInsurance
    },
    {
      title:idEducation?.length>0 ? "EDUCATION":'',
      data:idEducation
    },
    {
      title:idEmployement?.length>0 ? "EMPLOYMENT":'',
      data:idEmployement
    },
    {
      title:idFinanace?.length>0 ? "FINANCE":'',
      data:idFinanace
    },
   
  ]
  const filteredLocalArray = localArray?.filter(item => item?.data?.length > 0);
    return filteredLocalArray ;
  }

  const listEmpty = () => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text>No Documents found</Text>
      </View>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 200,
          backgroundColor: "#fff",
        }}
      >
        <View>
          <Header
            rightIconPress={onPressNavigateTo}
            leftIconSource={LocalImages.logoImage}
            rightIconSource={LocalImages.addImage}
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>

          {documentsDetailsList?.responseData &&
          documentsDetailsList?.responseData?.length > 0 ? (
            <TextInput
              leftIcon={LocalImages.searchImage}
              style={{
                container: styles.textInputContainer,
              }}
              isError={false}
              isNumeric={false}
              placeholder={"Search documents"}
              value={searchText}
              onChangeText={onChangeHandler}
            />
          ) : null}

          {documentsDetailsList?.responseData &&
          documentsDetailsList?.responseData?.length > 0 ? (
            <SectionList<any>
              sections={getFilteredData()}
              renderItem={_renderItem}
              renderSectionHeader={({section})=>(
                section?.title!='' &&
                <View style={{ flexDirection: "row", marginTop: 10,marginLeft:20 }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Avatar
                    isCategory={true}
                    isUploaded={false}
                    iconSource={getCategoryImages({
                      categoryType: section?.title,
                      name: undefined
                    })?.URI}
                    style={{
                      container: [
                        styles.avatarContainer,
                        {
                          backgroundColor: getCategoryImages({
                            categoryType: section?.title,
                            name: undefined
                          })?.COLOR,
                          flexDirection: "row",
                        },
                      ],
                      imgContainer: styles.avatarImageContainer,
                      text: styles.avatarTextContainer,
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -20,
                  }}
                >
                  <GenericText
                    style={[
                      { fontSize: 15, fontWeight: "bold", marginHorizontal: 9 },
                    ]}
                  >
                    {section?.title}
                  </GenericText>
                </View>
              </View>
              )}
              ListEmptyComponent={listEmpty}
              
            />
          ) : (
            // <GenericText
            // style={{
            //   color:"black",
            //   alignSelf:"center",
            //   marginTop:"30%",
            //   fontSize:18
            // }}
            // >{"norecentactivity"}
            // </GenericText>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30%",
              }}
            >
              <Image
                resizeMode="contain"
                style={[styles.logoContainers]}
                source={LocalImages.recent}
              ></Image>
            </View>
          )}

          <BottomSheet
            onClose={() => setisBottomSheetForSideOptionVisible(false)}
            height={230}
            isVisible={isBottomSheetForSideOptionVisible}
          >
            <View style={{ height: 180, width: "100%", paddingHorizontal: 30 }}>
              <RowOption
                rowAction={() => editItem()}
                title={"edit"}
                icon={LocalImages.editIcon}
              />
              <RowOption
                rowAction={() => qrCodeModal()}
                title={"QR Code"}
                icon={LocalImages.qrcodeImage}
              />
              <RowOption
                rowAction={() => shareItem()}
                title={"share"}
                icon={LocalImages.shareImage}
              />
              <RowOption
                rowAction={() => deleteItem()}
                title={"delete"}
                icon={LocalImages.deleteImage}
              />
            </View>
          </BottomSheet>

          <BottomSheet
            onClose={() => setIsBottomSheetForShare(false)}
            height={150}
            isVisible={isBottomSheetForShare}
          >
            <View style={{ height: 50, width: "100%", paddingHorizontal: 30 }}>
              <RowOption
                rowAction={() => shareItem()}
                title={"Share"}
                icon={LocalImages.shareImage}
              />
            </View>
          </BottomSheet>
          <BottomSheet
            onClose={() => setisBottomSheetForFilterVisible(false)}
            height={150}
            isVisible={isBottomSheetForFilterVisible}
          >
            <View style={{ height: 150, width: "100%", paddingHorizontal: 30 }}>
              <RowOption title={"By Category"} />
              <RowOption title={"By Date"} />
              <RowOption title={"By Frequency"} />
            </View>
          </BottomSheet>
        </View>
      </ScrollView>
      <Modal isVisible={isModalVisible} backdropOpacity={0.5}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setisBottomSheetForSideOptionVisible(false);
          }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 350,
              height: 240,
              backgroundColor: "#fff",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {activityLoader && !signedUrl ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator
                  size={"small"}
                  color={"red"}
                ></ActivityIndicator>
              </View>
            ) : (
              <QRCode
                getBase64={(base64: string) => {
                  qrBase64 = base64;
                  setBase64(base64);
                }}
                value={signedUrl}
                size={200}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: Screens.colors.background,
  },
  linearStyle: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  flatPanel: {
    marginHorizontal: 25,
    height: 80,
    borderRadius: 15,
    backgroundColor: Screens.colors.background,
    elevation: 15,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alignCenter: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "bold",
    color: Screens.black,
  },
  textInputContainer: {
    backgroundColor: "#fff",
    elevation: 1,
    borderColor: "transparent",
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  categoryHeaderText: {
    marginHorizontal: 30,
    marginVertical: 20,
    color: Screens.headingtextColor,
  },

  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Screens.pureWhite,
    // backgroundColor:'red',
    title: {
      color: Screens.black,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
    },

    avatarImageContainer: {
      width: 25,
      height: 30,
      marginTop: 5,
    },
    avatarTextContainer: {
      fontSize: 13,
      fontWeight: "500",
    },
  },
  documentContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    flex: 1,
    backgroundColor: Screens.pureWhite,
  },
  logoContainer: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  avatarImageContainer: {
    width: 15,
    height: 15,
    marginTop: 5,
    tintColor: "#fff",
  },
  avatarTextContainer: {
    fontSize: 13,
    fontWeight: "500",
  },
  logoContainers: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
});

export default DocumentScreen;
