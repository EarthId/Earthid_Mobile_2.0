import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import Button from "../../components/Button";
import Header from "../../components/Header";
import SuccessPopUp from "../../components/Loader";
import AnimatedLoader from "../../components/Loader/AnimatedLoader";
import { LocalImages } from "../../constants/imageUrlConstants";
import { useFetch } from "../../hooks/use-fetch";
import { Screens } from "../../themes/index";
import { selfieeverifyAPI } from "../../utils/earthid_account";

const VerifiDocumentScreen = (props: any) => {
  const { uploadedDocuments } = props.route.params;
  const { faceImageData } = props.route.params;
  const { loading, data, error, fetch } = useFetch();
  const [successResponse, setsuccessResponse] = useState(false);
  var base64Icon = `data:image/png;base64,${faceImageData?.base64}`;
  var uploadedDocumentsBase64 = `data:image/png;base64,${uploadedDocuments?.base64}`;
  console.log("uploadedDocuments", uploadedDocumentsBase64);

  const validateImages = () => {
    const requestBody = {
      docPhotoUrl: uploadedDocuments,
      selfieBase64: faceImageData,
    };

    fetch(selfieeverifyAPI, requestBody, "POST");
  };
  useEffect(() => {
    if (data) {
      setsuccessResponse(true);
      setTimeout(() => {
        setsuccessResponse(false);
      }, 3000);
    }
  }, [data]);
  return (
    <View style={styles.sectionContainer}>
      <Header
        isLogoAlone={true}
        linearStyle={styles.linearStyle}
        containerStyle={{
          iconStyle: {
            width: 150,
            height: 72,
            marginTop: 0,
          },
          iconContainer: styles.alignCenter,
        }}
      ></Header>
      <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={[styles.logoContainer]}
            source={LocalImages.closeImage}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.dashedLine}>
        <Image
          resizeMode={"contain"}
          style={{
            width: 330,
            height: "100%",
          }}
          source={{ uri: uploadedDocumentsBase64 }}
        ></Image>
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

      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <Button
          onPress={validateImages}
          style={{
            buttonContainer: {
              elevation: 5,
              margin: 20,
              width: 300,
            },
            text: {
              color: Screens.pureWhite,
            },
            iconStyle: {
              tintColor: Screens.pureWhite,
            },
          }}
          title={"SUBMIT"}
        ></Button>
      </View>

      <AnimatedLoader isLoaderVisible={loading} loadingText="verifying..." />
      <SuccessPopUp
        isLoaderVisible={successResponse}
        loadingText={"Verification succeeded"}
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
