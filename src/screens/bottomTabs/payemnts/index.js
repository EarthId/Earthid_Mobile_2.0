import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";
import { Screens } from "../../../themes";
import { dateTime } from "../../../utils/encryption";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { isEarthId } from "../../../utils/PlatFormUtils";
import { LocalImages } from "../../../constants/imageUrlConstants";
import Header from "../../../components/Header";
import {
  createUserSignature,
  saveDocuments,
} from "../../../redux/actions/authenticationAction";
import {
  PlaidLink,
  LinkSuccess,
  LinkExit,
  LinkLogLevel,
  LinkIOSPresentationStyle,
} from "react-native-plaid-link-sdk";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
const Payment = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useAppDispatch();
  const [bankdata, setBankDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [accessTokenNew, setAccessTokenNew] = useState(null);
  const documentsDetailsList = useAppSelector((state) => state.Documents);
  const [accounts, setAccounts] = useState([]);
  const navigation = useNavigation();
  const createVerifiableCred = (verifyVcCred) => {
    var date = dateTime();
    setLoading(true);
    var documentDetails: IDocumentProps = {
      id: `ID_VERIFICATION${Math.random()}${"selectedDocument"}${Math.random()}`,
      name: "Proof of funds",
      path: "filePath",
      documentName: "Proof of funds",
      categoryType: "Finance",
      date: date?.date,
      time: date?.time,
      txId: "data?.result",
      // docType: verifyVcCred?.type[1],
      docExt: ".jpg",
      processedDoc: "",
      isVc: true,
      vc: JSON.stringify(verifyVcCred),
      verifiableCredential: verifyVcCred,
      docName: "",
      base64: undefined,
    };

    var DocumentList = documentsDetailsList?.responseData
      ? documentsDetailsList?.responseData
      : [];
    DocumentList.push(documentDetails);

    dispatch(saveDocuments(DocumentList)).then(() => {
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Proof of funds is successfully generated");
        props.navigation.navigate("Documents");
      }, 1000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
        const response = await fetch("https://api.4wrd.tech:8243/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic NWpGQTRFOGM4Rjhqb1kwbGFhc1VtU0NUSnJVYTpuQTFFSXJJNFp6aVpvZXRhakxRa3B2QTFJTkFh",
            // You may need to include additional headers here, such as authentication headers
          },
          body: "grant_type=client_credentials",
        });
        console.log("Response Status:", response.status);
        // Check if the request was successful
        if (!response.ok) {
          setLoading(false);
          throw new Error("Network response was not ok");
        }

        // Get the response text directly
        const result = await response.json();
        console.log("result:::::", result);
        createAccessToken(result?.access_token);
        setAccessToken(result?.access_token);

        // Set the data in the state
        // Depending on your use case, you may handle the result here
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:1234", error);
      }
    };

    fetchData();
  }, []);
  const _toggleDrawer = () => {
    props.navigation.openDrawer();
  };
  const createAccessToken = async (token) => {
    setLoading(true);
    try {
      const username = "SandboxUser1";
      const password = "SandboxUser1";
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", encodeURIComponent(username));
      body.append("password", encodeURIComponent(password));

      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
      const response = await fetch(
        "https://api.4wrd.tech:8243/authorize/2.0/token?provider=AB4WRD",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
            // You may need to include additional headers here, such as authentication headers
          },
          body: body.toString(),
        }
      );
      console.log("Response Status:", response.status);
      // Check if the request was successful
      if (!response.ok) {
        setLoading(false);
        console.log("response", response);
        throw new Error("Network response was not ok");
      }

      // Get the response text directly
      const result = await response.json();
      setAccessTokenNew(result?.access_token);

      setLoading(false);
      // Set the data in the state
      // Depending on your use case, you may handle the result here
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:1234", error);
    }
  };

  useEffect(() => {
    if (accessTokenNew) {
      getAccounts();
    }
  }, [accessTokenNew]);

  const getAccounts = async () => {
    console.log("token====>", `Bearer ${accessToken}`);
    setLoading(true);
    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
      const response = await fetch(
        "https:/api.4wrd.tech:8243/manage-accounts/api/2.0/accounts?provider=AB4WRD",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "token-id": accessTokenNew,
            // You may need to include additional headers here, such as authentication headers
          },
        }
      );
      console.log("Response Status:123", response.status);
      // Check if the request was successful
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      // Get the response text directly
      const result = await response.json();
      setAccounts(result?.Data?.Account);

      setLoading(false);
      // Set the data in the state
      // Depending on your use case, you may handle the result here
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:1234", error);
    }
  };
  const renderItem = ({ item }) => (
    <View
      style={{ borderBottomWidth: 1, borderBottomColor: "#000", padding: 10 }}
    >
      <Text>{`Account ID: ${item.AccountId}`}</Text>
      <Text>{`Status: ${item.Status}`}</Text>
      <Text>{`Currency: ${item.Currency}`}</Text>
      {/* Add more fields as needed */}
      {item.Account && (
        <View
          style={{
            marginVertical: 10,
            backgroundColor: Screens.colors.header.middleColor,
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#fff" }}>
            Account Details:
          </Text>
          {item.Account.map((subAccount, index) => (
            <View key={index}>
              <Text
                style={{ color: "#fff", fontSize: 10 }}
              >{`Scheme Name: ${subAccount.SchemeName}`}</Text>
              <Text
                style={{ color: "#fff", fontSize: 10 }}
              >{`Identification: ${subAccount.Identification}`}</Text>
              <Text
                style={{ color: "#fff", fontSize: 10 }}
              >{`Secondary Identification: ${subAccount.SecondaryIdentification}`}</Text>
            </View>
          ))}
        </View>
      )}
      {item.Balance && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Balance:</Text>
          {item.Balance.map((balance, index) => (
            <View key={index}>
              <Text>{`Type: ${balance.Type}`}</Text>
              <Text>{`Amount: ${balance.Amount.Amount} ${balance.Amount.Currency}`}</Text>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => createVerifiableCred()}>
        <View>
          <View
            style={{
              width: 140,
              height: 50,
              backgroundColor: Screens.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Create VC</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        letfIconPress={() => getBack()}
        isLogoAlone={true}
        headingText={"Payments"}
        linearStyle={styles.linearStyle}
        containerStyle={{
          iconStyle: {
            width: 205,
            height: 72,
            marginTop: 30,
          },
          iconContainer: styles.alignCenter,
        }}
      ></Header>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          marginTop: 38,
          marginLeft: 20,
        }}
      >
        <Image
          source={LocalImages.backImage}
          style={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            tintColor: isEarthId() ? Screens.pureWhite : Screens.black,
          }}
        />
      </TouchableOpacity>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={"red"}></ActivityIndicator>
        </View>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
            padding: 5,
            paddingHorizontal: 20,
          }}
        >
          <Text>
            Please connect with bank in order to access the account details.
            Thanks!
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("BankLoginScreen", {
                accounts: accounts,
              })
            }
          >
            <View>
              <View
                style={{
                  width: 170,
                  height: 50,
                  marginTop: 100,
                  backgroundColor: Screens.colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Connect with bank
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
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

export default Payment;
