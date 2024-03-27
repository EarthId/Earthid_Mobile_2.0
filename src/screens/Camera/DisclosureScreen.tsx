import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, AsyncStorage } from "react-native";
import { Screens } from "../../themes";
import QrCodeMask from "react-native-qrcode-mask";
import GenericText from "../../components/Text";
const { height, width } = Dimensions.get("window");
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { isEarthId } from "../../utils/PlatFormUtils";
import CheckBox from "@react-native-community/checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { LocalImages } from "../../constants/imageUrlConstants";
import { SCREENS } from "../../constants/Labels";
const data = [
  { label: " 1", value: "1" },
  { label: " 2", value: "2" },
  { label: " 3", value: "3" },
  { label: " 4", value: "4" },
  { label: " 5", value: "5" },
  { label: " 6", value: "6" },
  { label: " 7", value: "7" },
  { label: " 8", value: "8" },
];
export const QrScannerMaskedWidget = ({createVerifiableCredentials,setValue,navigation,setIsCamerVisible,barCodeDataDetails,selectedCheckBox,setselectedCheckBox,setisDocumentModalkyc,navigateToCamerScreen,isLoading}:any) => {
  const documentsDetailsList = useAppSelector((state) => state.Documents);
  const [showVisibleDOB,setshowVisibleDOB] = useState(false)
  const [showVisibleBalance,setshowVisibleBalance] = useState(false)

  const [userDOB, setUserDOB] = useState<string | null>(null); // Changed to accept null value

  useEffect(() => {
    // Retrieve user's DOB from AsyncStorage
    AsyncStorage.getItem("userDOB").then((dob: React.SetStateAction<string | null>) => {
      setUserDOB(dob);
    }).catch((error: any) => {
      console.log("Error retrieving user's DOB from AsyncStorage: ", error);
    });
  }, []);



    const getDropDownList = () => {
        let datas = [];
        datas = documentsDetailsList?.responseData;
        if (barCodeDataDetails?.requestType?.request==='minAge') {
       
          datas = datas?.filter((item: { isVc: any }) => item.isVc && item?.documentName === 'Proof of age');
          return datas;
        }
        else if(barCodeDataDetails?.requestType?.request === 'balance'){
       
          datas = datas?.filter((item: { isVc: any }) => {
            console.log('times',item?.documentName)
           return item.isVc && item?.documentName === 'Proof of funds'
          });
          return datas;
        }
        return datas;
      };
      

      const checkDisable =()=>{
       return getDropDownList().length>0
      }
    
  return (
    <View style={{flex:1,backgroundColor:'#fff',zIndex:100}}>
      <View style={{margin:20}}>
      <TouchableOpacity
          onPress={() =>{
            setisDocumentModalkyc(false);
            setIsCamerVisible(true);
          }
          }
        >
          <Image
            resizeMode="contain"
            style={{width:15,height:15,tintColor:'#000'}}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>
         
        {isLoading ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>        
          <ActivityIndicator color={'red'} size='large' />
          </View>:
        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          
          {documentsDetailsList?.responseData?.length === 0 ||
            (documentsDetailsList?.responseData === undefined && (
              <TouchableOpacity onPress={() => navigateToCamerScreen()}>
                <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
                  <GenericText
                    style={{
                      textAlign: "center",
                      color: Screens.colors.ScanButton.startColor,
                      fontSize: 14,
                      fontWeight: "900",
                    }}
                  >
                    {"+ Add Documents"}
                  </GenericText>
                </View>
              </TouchableOpacity>
            ))}
               <GenericText
            style={{
              
              padding: 5,
              color: "#000",
              fontSize: 16,
              fontWeight: "900",
              marginTop: 20,
            }}
          >
            {'Share credential?'}
          </GenericText>
          <GenericText
            style={{
              
              padding: 5,
              color: "#000",
              fontSize: 16,
              marginTop: 1,
            }}
          >
            {isEarthId() ? "earthidwanttoaccess" : "globalidwanttoaccess"}
          </GenericText>
          <View style={{height:170,margin:5,borderRadius:10,backgroundColor:'#293fee',padding:10}}>
             <View style={{width:30,height:30,borderRadius:15,backgroundColor:'#57c891',justifyContent:'center',alignItems:'center'}}>
             <Image
            resizeMode="contain"
            style={{width:10,height:10,tintColor:'#fff'}}
            source={require('../../../resources/images/tik.png')}
          ></Image>
         
             </View>
             <GenericText
            style={{
              
              padding: 5,
              color: "#fff",
              fontSize: 14,
              fontWeight: "900",
              marginTop: 5,
            }}
          >
            {'Anonymous verifications'}
          </GenericText>
          <GenericText
            style={{
              
              padding: 5,
              color:'#85b0a5' ,
              fontWeight:'bold',
              fontSize: 15,
              marginTop: 1,
            }}
          >
            {barCodeDataDetails?.requestType?.request==='minAge'? 'Your exact date of birth will not be disclosed. This system is designed only to confirm whether your age falls within the specified acceptable range.':"Your exact amount of income will not be disclosed. This verifier can only confirm that your balance falls within the acceptable range that they have specified"}
          </GenericText>
          </View>
          <View style={{ height: 300 }}>
            <ScrollView
              style={{ flexGrow: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View>
                {getDropDownList() &&
                  getDropDownList().length > 0 &&
                  getDropDownList()?.map(
                    (
                      item: {
                        docName:
                          | boolean
                          | React.ReactChild
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                        id: any;
                        name:
                          | boolean
                          | React.ReactChild
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      },
                      index: any
                    ) => {
                      console.log("item", item);
                      return (
                        <View style={{height:150,borderRadius:20,backgroundColor:'#9EDCF0' ,marginHorizontal:10,padding:10}}>
                            <View
                          style={{ flexDirection: "row", marginVertical: 10 }}
                        >
                        
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              width:120,
                              flexWrap:'wrap'
                            }}
                          >
                            <GenericText
                              style={{
                                textAlign: "center",
                                padding: 5,
                                color: "#000",
                                fontSize: 14,
                                fontWeight: "700",

                              }}
                            >
                              {item?.isVc?item.documentName: item?.docName }
                            </GenericText>
                          </View>
                          <View style={{width:30,height:30,borderRadius:15,backgroundColor:'#57c891',justifyContent:'center',alignItems:'center'}}>
             <Image
            resizeMode="contain"
            style={{width:10,height:10,tintColor:'#fff'}}
            source={require('../../../resources/images/tik.png')}
          ></Image>
      
             </View>
             <GenericText
                              style={{
                                textAlign: "center",
                                padding: 5,
                                color: "#000",
                                fontSize: 14,
                                fontWeight: "700",

                              }}
                            >
                              {'Verified'}
                            </GenericText>
                        </View>
                        <View style={{flexDirection:'row'}}>
                        <GenericText
                              style={{
                               
                                padding: 5,
                                color: "#000",
                                fontSize: 14,
                                fontWeight: "700",

                              }}
                            >
                              {barCodeDataDetails?.requestType?.request==='minAge'?'Date of birth':'Balance'}
                            </GenericText>
                            <TouchableOpacity onPress={()=>barCodeDataDetails?.requestType?.request==='minAge'?setshowVisibleDOB(!showVisibleDOB):setshowVisibleBalance(!showVisibleBalance)}>

                              {barCodeDataDetails?.requestType?.request==='minAge' ? <GenericText
                              style={{
                               
                                padding: 5,
                                color: "#0163f7",
                                fontSize: 14,
                                fontWeight: "700",

                              }}
                            >
                              {!showVisibleDOB?'Show':'Hide'}
                            </GenericText>:
                             <GenericText
                             style={{
                              
                               padding: 5,
                               color: "#0163f7",
                               fontSize: 14,
                               fontWeight: "700",

                             }}
                           >
                             {!showVisibleBalance?'Show':'Hide'}
                           </GenericText>}
                        
                            </TouchableOpacity>
                         
                        </View>
                       
                            <GenericText
                              style={{
                               
                                padding: 5,
                                color: "#000",
                                fontSize:showVisibleDOB?14: 25,
                                fontWeight: 'bold',

                              }}
                            >
                             {barCodeDataDetails?.requestType?.request==='minAge'?showVisibleDOB?(userDOB ? userDOB : 'Date of birth not available'):'.. .. ....':showVisibleBalance?"$ "+item?.amount: '$.....'}
                            </GenericText>
                        </View>
                      
                      );
                    }
                  )}
              </View>
            </ScrollView>

            {/* <GenericText
              style={{
                textAlign: "center",
                padding: 5,
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {"Selected Duration"}
            </GenericText>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Expiry Time (default 1 day)"}
              searchPlaceholder="Search..."
              value={"value"}
              onChange={(item) => {
                setValue(item.value);
              }}
            /> */}
          </View>
      
        </View>}
        <View style={{flex:1,marginTop:400}}>
              {!isLoading &&<TouchableOpacity
              style={{ opacity: !checkDisable() ? 0.5 : 1,backgroundColor:'#0163f7',marginHorizontal:10,padding:15 ,borderRadius:20,justifyContent:'center',alignItems:'center'}}
              disabled={!checkDisable()}
              onPress={createVerifiableCredentials}
            >
              <GenericText
                style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
              >
                {"SHARE"}
              </GenericText>
            </TouchableOpacity>}
            {/* <TouchableOpacity
              onPress={() => {
                setisDocumentModalkyc(false);
                setIsCamerVisible(true);
              }}
            >
              <GenericText
                style={{ color: "red", fontSize: 16, fontWeight: "700" }}
              >
                Cancel
              </GenericText>
            </TouchableOpacity>
          */}
          </View>
    </View>
  );
};

export default QrScannerMaskedWidget;

const styles = StyleSheet.create({
  maskOutter: {
    position: "absolute",
    top: -50,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
});
