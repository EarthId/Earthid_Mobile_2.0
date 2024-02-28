import React, { useState } from "react";
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
}: any) => {
  const documentsDetailsList = useAppSelector((state) => state?.Documents);
  console.log("documentsDetailsList==>", documentsDetailsList);
  const [showVisibleDOB, setshowVisibleDOB] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [parentCheckbox, setParentCheckbox] = useState(false);
  const [childCheckboxes, setChildCheckboxes] = useState([]);

  const handleParentCheckboxChange = () => {
    setParentCheckbox(!parentCheckbox);
    setChildCheckboxes(childCheckboxes.map(() => !parentCheckbox));
  };

  const handleChildCheckboxChange = (childIndex: number) => {
    const updatedChildCheckboxes = [...childCheckboxes];
    updatedChildCheckboxes[childIndex] = !updatedChildCheckboxes[childIndex];
    setChildCheckboxes(updatedChildCheckboxes);

    if (updatedChildCheckboxes.every((checkbox) => checkbox)) {
      setParentCheckbox(true);
    } else if (updatedChildCheckboxes.every((checkbox) => !checkbox)) {
      setParentCheckbox(false);
    }
  };
  const data = [
    {
      id: "1",
      title: "Adhaar card",
      name: "John Doe",
      age: 25,
      address: "123 Main St",
    },
    {
      id: "2",
      title: "National ID",
      name: "Jane Smith",
      age: 30,
      address: "456 Oak Ave",
    },
    // Add more data as needed
  ];
  const renderItem = ({ item, index }) => (
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
              <Text style={{ fontSize: 14 }}>{item?.documentName}</Text>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderWidth: 0.6,
                borderColor: "#0163f7",
              }}
            >
              <Text>Name: vicky</Text>
              <CheckBox
                disabled={false}
                value={childCheckboxes[0]}
                onValueChange={() => (
                  setParentCheckbox(true), handleChildCheckboxChange(0)
                )}
              />
            </View>
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  borderWidth: 0.6,
                  borderColor: "#0163f7",
                }}
              >
                <Text>Age: 25</Text>
                <CheckBox
                  disabled={false}
                  value={childCheckboxes[1]}
                  onValueChange={() => (
                    setParentCheckbox(true), handleChildCheckboxChange(1)
                  )}
                />
              </View>
            </View>
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  borderWidth: 0.6,
                  borderColor: "#0163f7",
                }}
              >
                <Text>Address: chennai</Text>
                <CheckBox
                  disabled={false}
                  value={childCheckboxes[2]}
                  onValueChange={() => (
                    setParentCheckbox(true), handleChildCheckboxChange(2)
                  )}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
              fontSize: 16,
              fontWeight: "900",
              marginTop: 20,
            }}
          >
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
              data={documentsDetailsList?.responseData?.filter(
                (item) => item.isVc
              )}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={{ flex: 1 }}>
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
                onPress={createVerifiableCredentials}
              >
                <GenericText
                  style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                >
                  {"SHARE"}
                </GenericText>
              </TouchableOpacity>
            )}
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
      </ScrollView>
    </View>
  );
};

export default QrScannerMaskedWidget;
