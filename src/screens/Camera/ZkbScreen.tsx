import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export const QrScannerMaskedWidget = ({
  createVerifiableCredentials,
  setIsCamerVisible,
  barCodeDataDetails,
  setisDocumentModalkyc,
  isLoading,
  onDataShare,
}: any) => {
  const documentsDetailsList = useAppSelector((state) => state?.Documents);
  const [showVisibleDOB, setshowVisibleDOB] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [parentCheckbox, setParentCheckbox] = useState(false);
  const [childCheckboxes, setChildCheckboxes] = useState({});

  const [documentVc, setDocumentVc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedDocumentVc = await retrieveDocumentVcFromStorage();
     console.log('Stored Document VC', storedDocumentVc)
      //console.log('This is documentDetailsList---------------------------------', documentsDetailsList)
//const storedDocumentVc = documentsDetailsList.responseData[documentsDetailsList.responseData.length - 2]?.vc
console.log('Stored Document VC', storedDocumentVc)
      setDocumentVc(storedDocumentVc);
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
          style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
        >
          <View
            style={{
              height: 100,
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
  
            <CheckBox
              disabled={false}
              value={parentCheckbox}
              onValueChange={handleParentCheckboxChange}
            />
          </View>
  
          {expandedItem === item.id && (
  <View style={{ marginTop: 8, marginLeft: 20 }}>
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
            borderColor: "#0163f7",
          }}
        >
          <Text>{fieldName}: {documentVc.credentialSubject[0][fieldName]}</Text>
          <CheckBox
            disabled={false}
            value={childCheckboxes[fieldName]}
            onValueChange={() => handleChildCheckboxChange(fieldName)}
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 100 }}>
      <ScrollView>
        <View>
          <View style={{ margin: 20 }}>
            <TouchableOpacity
              onPress={() => {
                setisDocumentModalkyc(false);
                setIsCamerVisible(true);
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: 15, height: 15, tintColor: "#000" }}
                source={LocalImages.closeImage}
              ></Image>
            </TouchableOpacity>
          </View>
          <GenericText
            style={{
              padding: 5,
              color: "#000",
              fontSize: 16            }}>
              {"Select which details to share?"}
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
            {isLoading ? (
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
            )}
  
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={documentVc ? [documentVc] : []}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
  
            <View style={{ flex: 1, marginBottom: 100 }}>
              {!isLoading && (
                <TouchableOpacity
                  style={{
                    opacity: !checkDisable() ? 0.5 : 1,
                    backgroundColor: "#0163f7",
                    marginHorizontal: 10,
                    padding: 15,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  disabled={!checkDisable()}
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
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default QrScannerMaskedWidget;
  
