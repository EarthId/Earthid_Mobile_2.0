import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import LinearGradients from "../../components/GradientsPanel/LinearGradient";
import { Switch } from "react-native-gesture-handler";
import { addConsent } from "../../utils/consentApis";

export const QrScannerMaskedWidget = ({
  createVerifiableCredentials,
  barCodeDataDetails,
  isLoading,
  onDataShare,
  navigation, // Add navigation prop
}: any) => {
  const documentsDetailsList = useAppSelector((state) => state?.Documents);
  const [showVisibleDOB, setshowVisibleDOB] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [parentCheckbox, setParentCheckbox] = useState(false);
  const [childCheckboxes, setChildCheckboxes] = useState({});

  const [documentVc, setDocumentVc] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const userDetails = useAppSelector((state) => state.account);

  console.log("This is for consent:-------------------------------------------------", isChecked)



  useEffect(() => {
    const fetchData = async () => {
      const storedDocumentVc = await retrieveDocumentVcFromStorage();
      if (storedDocumentVc === null) {
        Alert.alert(
          "No Documents",
          "Please add the required documents",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Documents"),
            },
          ],
          { cancelable: false }
        );
      } else{
        console.log('Stored Document VC', storedDocumentVc)
        //console.log('This is documentDetailsList---------------------------------', documentsDetailsList)
  //const storedDocumentVc = documentsDetailsList.responseData[documentsDetailsList.responseData.length - 2]?.vc
  console.log('Stored Document VC', storedDocumentVc)
        setDocumentVc(storedDocumentVc);
      }
     
    };

    fetchData();
  }, []);

  const retrieveDocumentVcFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uploadedDocVc');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
      return null;
    }
  };

  const sendDataToParent = async () => {
    const selectedFields: { name: string; value: any; }[] = []; // Initialize selectedFields as an array
  
    // Iterate over the child checkboxes and populate selectedFields
    Object.keys(childCheckboxes).forEach((fieldName) => {
      if (childCheckboxes[fieldName]) {
        selectedFields.push({
          name: fieldName,
          value: documentVc.credentialSubject[0][fieldName]
        });
      }
    });
  console.log('These are the selected fields', selectedFields)
    // Call the onDataShare function passed from the parent component
    if(selectedFields && documentVc){
      await AsyncStorage.setItem("selectedFields", JSON.stringify({ selectedFields }));
      await AsyncStorage.setItem("selectedVc", JSON.stringify({ documentVc }));
      onDataShare(selectedFields, documentVc);
      await addConsentCall()
    }
    
  };

  const handleParentCheckboxChange = () => {
    setParentCheckbox(!parentCheckbox);
    const updatedChildCheckboxes = {};
    Object.keys(childCheckboxes).forEach(key => {
      updatedChildCheckboxes[key] = !parentCheckbox;
    });
    setChildCheckboxes(updatedChildCheckboxes);
  };

  const handleChildCheckboxChange = (fieldName: string) => {
    const updatedChildCheckboxes = { ...childCheckboxes };
    updatedChildCheckboxes[fieldName] = !updatedChildCheckboxes[fieldName];
    setChildCheckboxes(updatedChildCheckboxes);

    if (Object.values(updatedChildCheckboxes).every((checkbox) => checkbox)) {
      setParentCheckbox(true);
    } else if (Object.values(updatedChildCheckboxes).every((checkbox) => !checkbox)) {
      setParentCheckbox(false);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => (setExpandedItem(item.id), handleParentCheckboxChange())}
      >
        <View
          style={{ padding: 3, marginBottom: 15}}
        >
          <View
            style={{
              height: 90,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(246, 189, 233, 1)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={LocalImages.CATEGORIES.educationImage}
                    style={{ width: 13, height: 13, resizeMode: "contain" }}
                  ></Image>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 14 }}>{documentVc?.credentialSubject[0].type}</Text>
              </View>
            </View>
  
            <Switch
  trackColor={{ false: "#767577", true: "#81b0ff" }}
  thumbColor={parentCheckbox ? "#007AFF" : "#f4f3f4"} // Change the thumb color to blue when active
  ios_backgroundColor="#3e3e3e"
  onValueChange={handleParentCheckboxChange}
  value={parentCheckbox}
/>
          </View>

          {expandedItem === item.id && (
  <View style={{ marginTop: 8 }}>
  {documentVc && documentVc.credentialSubject[0] && Object.keys(documentVc.credentialSubject[0]).map((fieldName, fieldIndex) => {
    // Check if the field value is not null
    if (documentVc.credentialSubject[0][fieldName] !== null) {
      return (
        <View
          key={fieldIndex}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            borderWidth: 0.6,
            margin: 3,
            borderColor: "#0000001A",
            borderRadius: 5
          }}
        >
          {/* <Text>{fieldName}: {documentVc.credentialSubject[0][fieldName]}</Text> */}
          <Text style={
            {
              marginTop: 7
            }
          }>{fieldName}</Text>
<Switch
  trackColor={{ false: "#767577", true: "#81b0ff" }}
  thumbColor={childCheckboxes[fieldName] ? "#007AFF" : "#f4f3f4"} // Change the thumb color to blue when active
  ios_backgroundColor="#3e3e3e"
  onValueChange={() => handleChildCheckboxChange(fieldName)}
  value={childCheckboxes[fieldName]}
/>
        </View>
      );
    } else {
      // Return null if field value is null
      return null;
    }
  })}
</View>
)}
        </View>
      </TouchableOpacity>
    );
  };

  const getDropDownList = () => {
    let datas = [];
    datas = documentsDetailsList?.responseData;
    if (barCodeDataDetails?.requestType?.request === "minAge") {
      datas = datas?.filter(
        (item: { isVc: any }) =>
          item.isVc && item?.documentName === "Proof of age"
      );
      return datas;
    } else if (barCodeDataDetails?.requestType?.request === "balance") {
      datas = datas?.filter((item: { isVc: any }) => {
        console.log("times", item?.documentName);
        return item.isVc && item?.documentName === "Proof of funds";
      });
      return datas;
    }
    return datas;
  };

  const checkDisable = () => {
    return getDropDownList()?.length > 0;
  };


  const addConsentCall = async () => {
    try{
      console.log('These are userDetails===============================', userDetails)
   const apiData = {
    
      "earthId": userDetails.responseData.earthId,
      "flowName": "Selective Data Disclosure",
      "description": "Sharing selective fields from a document",
      "relyingParty": "EarthID",
      "timeDuration": 1,
      "isConsentActive": true,
      "purpose": "Sharing of information for selective disclosure"
  
   }
const consentApiCall = await addConsent(apiData)
console.log('Consent Api response------:', consentApiCall)
    }catch (error) {
      throw new Error(`Error adding consent: ${error}`);
    }
  } 


  const navigateToBack = () => {
    navigation.goBack(); // Use the navigation prop to go back
  }
  return (
   <View style={styles.sectionContainer}>
    <ScrollView contentContainerStyle={styles.sectionContainer}>
 <View 
    style={{flexGrow: 1,
      backgroundColor:'#fff'
      }}
    //style={styles.sectionContainer}
    >

      
      <View style={styles.linearStyle}>
      <LinearGradients
        endColor={Screens.colors.header.endColor}
       // middleColor={Screens.colors.header.middleColor}
        startColor={Screens.colors.header.startColor}
        style={styles.linearStyle}
        horizontalGradient={false}
      >
         </LinearGradients>
         </View>     

        <View style={styles.category}>
            
       
        <View style={{ marginEnd: 5, alignItems: 'flex-end' }}>
    <TouchableOpacity
      onPress={() => {
        navigateToBack();
      }}
    >
      <Image
        resizeMode="contain"
        style={{ width: 15, height: 15, tintColor: "#000" }}
        source={LocalImages.closeImage}
      />
    </TouchableOpacity>
  </View>


  {isLoading ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>        
          <ActivityIndicator color={'red'} size='large' />
          </View>:
        <View style={{ flex: 1, paddingHorizontal: 5 }}>

  <GenericText
    style={{
      //padding: 5,
      color: "#000",
      fontSize: 18,
      fontWeight: 600,
      paddingBottom: 5,
      paddingLeft: 9,
      paddingRight: 9,

    }}
  >
    {"Select which details to share?"}
  </GenericText>
 

            <GenericText
              style={{
                padding: 5,
                color: "#000",
                fontSize: 16,
                paddingBottom: 15,
              paddingLeft: 9,
    paddingRight: 9,
              }}
            >
              {isEarthId() ? "earthidwanttoaccess" : "globalidwanttoaccess"}
            </GenericText>
            {/* <ScrollView
    style={{ flexGrow: 1 }}
    contentContainerStyle={{ flexGrow: 1 }}
  > */}
            {/* {isLoading ? (
            
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                 alignItems: "center",
                }}
              >
                <ActivityIndicator color={"red"} size="large" />
              </View>
          
            ) : (
              <View style={{ flex: 1, paddingHorizontal: 5 }}></View>
            )} */}
  
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={documentVc ? [documentVc] : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
{/* </ScrollView> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:10, marginBottom: 20  }}>
        <CheckBox
          value={isChecked}

          onValueChange={(newValue) => setIsChecked(newValue)}
        />
        <GenericText style={{marginLeft: 10,marginRight: 35,  fontSize: 11}}>I agree to EarthID's Terms & Conditions and provide my consent for EarthID to use my data for this transaction.</GenericText>
      </View>

</View>}
  
            <View style={{  marginBottom: 5 }}>
              {!isLoading && (
                <TouchableOpacity
                  style={{
                    opacity: isChecked ? 1 : 0.5,
                    backgroundColor:'#2AA2DE',
                    marginHorizontal:10,
                    padding:15 ,
                    borderRadius:50,
                    justifyContent:'center',
                    alignItems:'center'
                  }}
                  disabled={!checkDisable()|| !isChecked}
                  onPress={() => {
                    sendDataToParent(); // Call sendDataToParent when share button is clicked
                    createVerifiableCredentials(); // Optionally, call createVerifiableCredentials
                  }}
                >
                  <GenericText
                    style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                  >
                    {"SHARE"}
                  </GenericText>
                </TouchableOpacity>
              )}
            </View>
            <View style={{marginTop: 5}}>
  {!isLoading && (
    <TouchableOpacity
      style={{
        //opacity: !checkDisable() ? 0.5 : 1,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D3D3D3',
      }}
      //disabled={!checkDisable()}
      onPress={() => {
        navigateToBack();
      }}
    >
      <GenericText
        style={{ color: "#525252", fontSize: 13, fontWeight: "700" }}
      >
        {"NO THANKS"}
      </GenericText>
    </TouchableOpacity>
  )}
</View>
            </View>
         
          
      </View>
      </ScrollView>
   </View>
   
     
    );
  };


  const styles = StyleSheet.create({

    sectionContainer: {
      flexGrow: 1,
      backgroundColor: Screens.colors.background,
      zIndex:1000
    },
    title: {
      color: Screens.grayShadeColor,
    },
    subtitle: {
      color: Screens.black,
      paddingLeft: 20,
      fontWeight: "bold",
      fontSize: 15,
      opacity: 1,
    },
    containerForSocialMedia: {
      marginTop: 10,
      marginHorizontal: 10,
      borderColor: Screens.grayShadeColor,
      borderWidth: 0.5,
      borderRadius: 10,
      justifyContent: "center",
    },
    logoContainer: {
      width: 100,
      height: 100,
    },
    textContainer: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    linearStyle: {
      height: 350,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 4,
    },
    categoryHeaderText: {
      marginHorizontal: 20,
      marginVertical: 10,
  
      color: Screens.headingtextColor,
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
    logoContainers: {
      width: 30,
      height: 30,
      tintColor: Screens.grayShadeColor,
    },
    alignCenter: { justifyContent: "center", alignItems: "center" },
    label: {
      fontWeight: "bold",
      color: Screens.black,
    },
    category: {
      backgroundColor: Screens.pureWhite,
      padding: 10,
      marginTop: -320,
      marginHorizontal: 15,
      elevation: 5,
      borderRadius: 10,
      flex: 1,
      justifyContent: "space-between",
      marginBottom: 100
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginHorizontal: 8,
      flexDirection: "row",
      backgroundColor: Screens.lightGray,
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
    cardContainer: {
      flex: 1,
      paddingVertical: 9,
      title: {
        color: Screens.grayShadeColor,
      },
    },
    textInputContainer: {
      borderRadius: 10,
      borderColor: Screens.colors.primary,
      borderWidth: 2,
      marginLeft: 10,
      marginTop: -2,
    },
  });
  
  export default QrScannerMaskedWidget;
  

