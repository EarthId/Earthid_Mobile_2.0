import { useIsFocused } from "@react-navigation/native";
import { values } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Alert,
  Button,
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
import { getColor } from "../../../utils/CommonFuntion";

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



  let categoryTypes = "";

  if (route?.params && route?.params?.category) {
    categoryTypes = route?.params?.category;
  }
  const dispatch = useAppDispatch();
  const [selectedItem, setselectedItem] = useState();
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
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [isCheckBoxEnable, setCheckBoxEnable] = useState(false);
  const [isClear, setIsClear] = useState(false);
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

  const getCategoryImages = (item: { categoryType: any; name: any }) => {
    const getItems = SCREENS.HOMESCREEN.categoryList.filter(
      (itemFiltered, index) => {
        return (
          itemFiltered.TITLE.toLowerCase() === item?.categoryType?.toLowerCase()
        );
      }
    );
  if(getItems[0]==undefined){
    return '#D7EFFB'
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


  const multiSelect = (item) => {
    // console.log(item?.base64, "@@@@@@@@@");
    // setMultipleDucuments(item);
    setCheckBoxEnable(!isCheckBoxEnable);
  };
  const _selectTigger = (item: any) => {
    item.isSelected = !item.isSelected;
    setselectedDocuments(item);
    setdocumentsDetailsList({ ...documentsDetailsList });
  };

  const _renderItem = ({ item, index }: any) => {
    // AsyncStorage.setItem("day", item.date);
    // setEdit(item)
    // setitemdata(item)
  console.log('itemss===>',item)
    return (
      <TouchableOpacity
        onLongPress={() =>{
           multiSelect(item)
          
          }
        }
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
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Avatar
              isCategory={true}
              isUploaded={false}
              iconSource={getCategoryImages(item)?.URI}
              style={{
                container: [
                  styles.avatarContainer,
                  {
                    backgroundColor: getCategoryImages(item)?.COLOR,
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
              {item?.isVc?item.name:item?.categoryType}
            </GenericText>
          </View>
        </View>

        <View style={{ marginTop: -20 }}>
          <Card
            titleIcon={item?.isVc ? LocalImages.vcImage : null}
            leftAvatar={LocalImages.documentsImage}
            absoluteCircleInnerImage={LocalImages.upImage}
            rightIconSrc={LocalImages.menuImage}
            rightIconOnPress={() => _rightIconOnPress(item) }
            title={item?.isVc ?item.name : item?.docName}
            subtitle={
              item.isVc
                ? `      Received  : ${item.date}`
                : `      Uploaded  : ${item.date}`
            }
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
                  backgroundColor:item?.isVc?'#D7EFFB': getImagesColor(item),
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  marginTop: 25,
                  marginLeft: 10,
                  marginRight: 5,
                },
                uploadImageStyle: {
                  backgroundColor:item?.isVc?'#D7EFFB': getImagesColor(item),
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

        const newDataItem=  documentsDetailsList?.responseData || []
        const newData =newDataItem.filter(function (item: {
          docName: string;
        }) {
          const itemData = item.docName ? item?.docName.toUpperCase() : "".toUpperCase();
    
          const textData = text?.toUpperCase();
    
          return itemData.indexOf(textData) > -1;
        });
        setsearchText(text);
       console.log(itemdata,'ITEMDATA')
       
        setSearchedData(newData);
      
     
    
   

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
      console.log("selectedItem?.base64===>", selectedItem?.base64);
      if (selectedItem?.docType === "jpg") {
        await Share.open({
          url: selectedItem?.base64,
        });
      } else {
        await Share.open({
          url: `data:image/jpeg;base64,${selectedItem?.base64}`,
        });
      }
    }
  };

  const shareMultipleItem = async () => {
    let temp = [];
    temp = documentsDetailsList?.responseData.filter((el) => {
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
    console.log('selectedItem?.id',selectedItem)
    Alert.alert(
      "Confirmation! ",
      "Are you sure you want to delete this document ?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
        {
          text: "OK",
          onPress: () => {
            setisBottomSheetForSideOptionVisible(false);
          
            const helpArra = [...documentsDetailsList?.responseData]
            console.log('documentsDetailsList',helpArra);
            const findIndex = helpArra?.findIndex((item)=>item.id === selectedItem?.id)
             findIndex >= -1 &&  helpArra?.splice(findIndex,1)
           // console.log('helpArra',helpArra)
            dispatch(saveDocuments(helpArra));
          },
        },
      ],
      { cancelable: false }
    );
  };


function editItem(){
  setisBottomSheetForSideOptionVisible(false)
   navigation.navigate("categoryScreen", { selectedItem: selectedItem , editDoc : "editDoc", itemData:edit})
  // var data : any =selectedItem
  // await AsyncStorage.setItem("userDetails", data);
  // await AsyncStorage.setItem("editDoc", "editDoc");

  console.log('iteName==>',selectedItem)
}


  const onPressNavigateTo = () => {
    navigation.navigate("uploadDocumentsScreen");
  };
  const _keyExtractor = ({ path }: any) => path.toString();

  const getFilteredData = () => {
    console.log('getFilteredData')
    let data = documentsDetailsList?.responseData;

    if (categoryTypes !== "") {
      var alter = function (item: any) {
        let splittedValue = item?.categoryType
          ?.trim()
          .split("(")[0]
          ?.toLowerCase();

        return splittedValue?.trim() === categoryTypes?.trim()?.toLowerCase(); //use the argument here.
      };
      var filter = documentsDetailsList?.responseData?.filter(alter);
      return filter;
    }

    if (searchedData.length > 0) {getFilteredData
      data = searchedData;
      return data;
    }

    if (searchedData.length === 0 && searchText != "") {
      return [];  // earlier []
    }
    console.log("searchedData====>{{}}}}}", data);
    return data;
  };
  const clearData = () => {};

  const listEmpty =()=>{
    return(
      <View style={{flex:1,alignItems:'center',}}>
       <Text>No Documents found</Text>
      </View>
    )
  }

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

      {
          documentsDetailsList?.responseData && documentsDetailsList?.responseData?.length> 0 ? 

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
          :
          null
    }

         
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

          {
             documentsDetailsList?.responseData && documentsDetailsList?.responseData?.length>0? 
          <FlatList<any>
            data={getFilteredData()}
            renderItem={_renderItem}
           ListEmptyComponent={listEmpty}
          />
          
            :

            // <GenericText
            // style={{
            //   color:"black",
            //   alignSelf:"center",
            //   marginTop:"30%",
            //   fontSize:18
            // }}
            // >{"norecentactivity"}
            // </GenericText>

            <View style={{ justifyContent: "center", alignItems: "center",marginTop:"30%" }}>
            <Image
              resizeMode="contain"
              style={[styles.logoContainers]}
              source={LocalImages.recent}
            ></Image>
          </View>

          }        


          <BottomSheet
            onClose={() => setisBottomSheetForSideOptionVisible(false)}
            height={200}
            isVisible={isBottomSheetForSideOptionVisible}
          >
            <View style={{ height: 150, width: "100%", paddingHorizontal: 30 }}>
            <RowOption
                rowAction={() => editItem()}
                title={"edit"}
                icon={LocalImages.editIcon}
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
    tintColor:"black"
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
