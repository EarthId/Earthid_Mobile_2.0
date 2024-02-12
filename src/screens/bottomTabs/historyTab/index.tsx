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
  AsyncStorage,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
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
import { saveDocuments } from "../../../redux/actions/authenticationAction";
import { Screens } from "../../../themes";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-image";
import { getColor } from "../../../utils/CommonFuntion";
import zlib from "zlib";
import Spinner from "react-native-loading-spinner-overlay/lib";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import AWS from "aws-sdk";
import { deleteAllBuckets } from "../../../utils/awsSetup";

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
  const [selectedDocuments, setselectedDocuments] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  let [qrBase64, setBase64] = useState("");

  const [activityLoader, setActivityLoad] = useState(false);

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

  const userDetails = useAppSelector((state) => state.account);

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

  const onPressNavigateTo = () => {
    navigation.navigate("uploadDocumentsScreen");
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
         
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>

      

          {isCheckBoxEnable && (
            <View
              style={{ alignItems: "flex-end", marginTop: 20, marginRight: 25 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // width: "20%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => shareMultipleItem()}>
                  <Image
                    source={LocalImages.shareImage}
                    style={{
                      height: 18,
                      width: 18,
                      marginRight: 15,
                      tintColor: "#293fee",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCheckBoxEnable(false);
                    setIsClear(true);
                  }}
                >
                  <Text style={{ color: "tomato", fontWeight: "500" }}>
                    CLEAR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
