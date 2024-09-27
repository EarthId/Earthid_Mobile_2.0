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
import GenericText from "../../components/Text";
import { useAppSelector } from "../../hooks/hooks";
import CheckBox from "@react-native-community/checkbox";
import { Switch } from "react-native-gesture-handler";
import { LocalImages } from "../../constants/imageUrlConstants";
import LinearGradients from "../../components/GradientsPanel/LinearGradient";
import CustomPopup from "../../components/Loader/customPopup";
import { isEarthId } from "../../utils/PlatFormUtils";
import GLOBALS from "../../utils/globals";
import { AWS_API_BASE } from "../../constants/URLContstants";

const { height, width } = Dimensions.get("window");

export const QrScannerMaskedWidget = ({
  createVerifiableCredentials,
  barCodeDataDetails,
  isLoading,
  onDataShare,
  navigation,
}: any) => {
  const documentsDetailsList = useAppSelector((state) => state?.Documents);
  const [expandedItem, setExpandedItem] = useState(null);
  const [parentCheckboxes, setParentCheckboxes] = useState({});
  const [childCheckboxes, setChildCheckboxes] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [parentDocument, setParentDocument] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [s3PathTemp, setS3PathTemp] = useState(null); 
  const [popupContent, setPopupContent] = useState({
    title: '',
    message: '',
    buttons: []
  });

  const showPopup = (title, message, buttons) => {
    setPopupContent({ title, message, buttons });
    setPopupVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedDocumentVc = await retrieveDocumentVcFromStorage();
      if (documentsDetailsList.responseData === null) {
        showPopup(
          "No Documents",
          "Please add the required documents",
          [
            {
              text: "OK",
              onPress: () => {
                setPopupVisible(false);
                navigation.navigate("Documents");
              }
            },
          ]
        );
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
    console.log("Calling sendDataToParent--------");
   // console.log("Selected Parent Document:", parentDocument);
    console.log("Selected child boxes:", childCheckboxes);
    const selectedFields = [];

    // Ensure we are referencing the correct selected parent document
  if (parentDocument && Object.keys(parentDocument).length > 0) {
    Object.keys(childCheckboxes).forEach((fieldName) => {
      if (childCheckboxes[fieldName]) {
        let fieldValue;

        // Check if the field is part of the credentialSubject or s3Path
        if (fieldName === 's3Path') {
          fieldValue = s3PathTemp; // Handle s3Path if present
        } else {
          fieldValue = parentDocument.credentialSubject?.[0]?.[fieldName]; // Handle credentialSubject fields
        }

        if (fieldValue) {
          selectedFields.push({
            name: fieldName,
            value: fieldValue,
          });
        }
      }
    });

     // console.log("Selected Parent Document:", parentDocument);
      console.log("Selected Fields:", selectedFields);

      // If selected fields and parent document are available, proceed to share
      if (selectedFields.length > 0) {
        await AsyncStorage.setItem("selectedFields", JSON.stringify(selectedFields));
        await AsyncStorage.setItem("selectedVc", JSON.stringify(parentDocument));
        onDataShare(selectedFields, parentDocument);
      } else {
        console.log("No fields selected");
      }
    } else {
      console.log("No parent document selected");
    }
  };

  const handleParentCheckboxChange = (docId, parentStatus) => {
    const updatedParentCheckboxes = {};

    if (!parentStatus) {
      updatedParentCheckboxes[docId] = true;
      const selectedParent = documentsDetailsList.responseData.find((doc) => doc.id === docId);
      setParentDocument(selectedParent?.verifiableCredential || selectedParent?.vc || selectedParent); // Ensure correct document is set
    } else {
      updatedParentCheckboxes[docId] = false;
      setParentDocument({}); // Reset if deselected
    }

    setParentCheckboxes(updatedParentCheckboxes);
    const document = documentsDetailsList.responseData.find((doc) => doc.id === docId);
    const updatedChildCheckboxes = {};
    console.log("Selected parent document :");

    if (document && (document.vc || document.verifiableCredential)) {
      const credentialSubject = document.vc?.credentialSubject || document.verifiableCredential?.credentialSubject;

      if (credentialSubject && credentialSubject[0]) {
        Object.keys(credentialSubject[0]).forEach((fieldName) => {
          updatedChildCheckboxes[fieldName] = !parentStatus;
        });
      }
    }else{
      updatedChildCheckboxes["s3Path"] = !parentStatus;
    }


  
console.log("updated child checkboxes:", updatedChildCheckboxes)
    setChildCheckboxes(updatedChildCheckboxes);
  };

  const handleChildCheckboxChange = async(fieldName, parentId) => {
    const updatedChildCheckboxes = { ...childCheckboxes };
    updatedChildCheckboxes[fieldName] = !updatedChildCheckboxes[fieldName];
    setChildCheckboxes(updatedChildCheckboxes);

    // Ensure parent document is updated correctly when a child is selected
    const isAnyChildSelected = Object.values(updatedChildCheckboxes).some((checked) => checked);

    // Find the correct parent document
    const parentDocument = documentsDetailsList.responseData.find((doc) => doc.id === parentId);
    console.log("Selected parent document via child:");

    if (isAnyChildSelected) {
      // Set parent document to either verifiableCredential or vc
      setParentDocument(parentDocument.verifiableCredential || parentDocument.vc || parentDocument);
      setParentCheckboxes({ [parentId]: true });
    } else {
      setParentDocument({});
      setParentCheckboxes({ [parentId]: false });
    }

    let s3PathTemp
    if(parentDocument.s3Path){
      s3PathTemp = await getQRCode(parentDocument.s3Path)
      setS3PathTemp(s3PathTemp); // Store s3PathTemp in state
    console.log('This is temp s3path:', s3PathTemp);
    }
    // Log the selected child field and its value
    const selectedChild = {
      name: fieldName,
      value: parentDocument?.verifiableCredential?.credentialSubject?.[0]?.[fieldName] || parentDocument?.vc?.credentialSubject?.[0]?.[fieldName] || s3PathTemp,  // or condition for field value, with `credentialSubject` check
    };

    console.log("Selected child field:", selectedChild);
    console.log("Selected parent document via child:");
  };

  async function getQRCode(s3DocPath) {
  
   
    console.log('This qr code s3doc path:  ', s3DocPath)
    const response = await fetch("https://" + AWS_API_BASE + "documents/geturl", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      credentials: GLOBALS.credentials,
      path: s3DocPath,
    }),
  });
  //console.log('Seleceted item full path:', selectedItem)
  console.log('This qr code api response:  ', response)
  let myJson = await response.json();
  console.log("this is myjson of doc qr code:",myJson);
  
  return myJson.url
  }

  const renderItem = ({ item }) => {
    const docId = item.id;
    const parentStatus = parentCheckboxes[docId];
    return (
      <TouchableOpacity onPress={() => setExpandedItem(docId)}>
        <View style={{ padding: 3, marginBottom: 15 }}>
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
                  />
                </View>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.docName || item.documentName}</Text>
              </View>
            </View>

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={parentStatus ? "#007AFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleParentCheckboxChange(docId, parentStatus)}
              value={parentStatus}
            />
          </View>

          {expandedItem === docId && (
  <View style={{ marginTop: 8 }}>
    {/* Check if credentialSubject or s3Path exists */}
    {item.verifiableCredential?.credentialSubject?.[0] || item.vc?.credentialSubject?.[0] ? (
      // Map through the fields in credentialSubject
      Object.keys(
        item.verifiableCredential?.credentialSubject?.[0] || item.vc?.credentialSubject?.[0]
      ).map((fieldName, fieldIndex) => {
        const fieldValue =
          item.verifiableCredential?.credentialSubject?.[0]?.[fieldName] ||
          item.vc?.credentialSubject?.[0]?.[fieldName];

        if (fieldValue !== null) {
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
                borderRadius: 5,
              }}
            >
              <Text style={{ marginTop: 7 }}>{fieldName}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={childCheckboxes[fieldName] ? "#007AFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => handleChildCheckboxChange(fieldName, docId)}
                value={childCheckboxes[fieldName]}
              />
            </View>
          );
        } else {
          return null;
        }
      })
    ) : item.s3Path ? (
      // Render a special block for s3Path
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          borderWidth: 0.6,
          margin: 3,
          borderColor: "#0000001A",
          borderRadius: 5,
        }}
      >
        <Text style={{ marginTop: 7 }}>Url</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={childCheckboxes['s3Path'] ? "#007AFF" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => handleChildCheckboxChange('s3Path', docId)}
          value={childCheckboxes['s3Path']}
        />
      </View>
    ) : (
      <></> // Render nothing if neither credentialSubject nor s3Path exists
    )}
  </View>
)}

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <ScrollView contentContainerStyle={styles.sectionContainer}>
        <View style={{ flexGrow: 1, backgroundColor: '#fff' }}>
          <View style={styles.linearStyle}>
            <LinearGradients
              endColor={Screens.colors.header.endColor}
              startColor={Screens.colors.header.startColor}
              style={styles.linearStyle}
              horizontalGradient={false}
            />
          </View>

          <View style={styles.category}>
            <View style={{ marginEnd: 5, alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  resizeMode="contain"
                  style={{ width: 15, height: 15, tintColor: "#000" }}
                  source={LocalImages.closeImage}
                />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'red'} size='large' />
              </View>
            ) : (
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <GenericText style={styles.textTitle}>{"Select which details to share?"}</GenericText>
                <GenericText style={styles.textSubtitle}>
                  {isEarthId() ? "earthidwanttoaccess" : "globalidwanttoaccess"}
                </GenericText>

                <View style={{ marginTop: 10 }}>
                  <FlatList
                    data={documentsDetailsList.responseData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
                  <CheckBox
                    value={isChecked}
                    onValueChange={(newValue) => setIsChecked(newValue)}
                  />
                  <GenericText style={{ marginLeft: 10, marginRight: 35, fontSize: 11 }}>
                    {isEarthId() ? "earthidconsent" : "globalidconsent"}
                  </GenericText>
                </View>
              </View>
            )}

<View style={{ marginBottom: 5 }}>
  {!isLoading && (
    <TouchableOpacity
      style={{
        opacity: parentDocument && Object.keys(parentDocument).length > 0 && isChecked ? 1 : 0.5,
        backgroundColor: '#2AA2DE',
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      // Disable button if parentDocument is null/empty or nothing is selected
      disabled={!parentDocument || Object.keys(parentDocument).length === 0 || !isChecked}
      onPress={() => {
        sendDataToParent();
        createVerifiableCredentials();
      }}
    >
      <GenericText style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
        {"SHARE"}
      </GenericText>
    </TouchableOpacity>
  )}
</View>


            <View style={{ marginTop: 5 }}>
              {!isLoading && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fff',
                    marginHorizontal: 10,
                    padding: 15,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#D3D3D3',
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <GenericText style={{ color: "#525252", fontSize: 13, fontWeight: "700" }}>
                    {"NO THANKS"}
                  </GenericText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomPopup
        isVisible={isPopupVisible}
        title={popupContent.title}
        message={popupContent.message}
        buttons={popupContent.buttons}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexGrow: 1,
    backgroundColor: Screens.colors.background,
    zIndex: 1000,
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
  linearStyle: {
    height: 350,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
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
    marginBottom: 100,
  },
});

export default QrScannerMaskedWidget;
