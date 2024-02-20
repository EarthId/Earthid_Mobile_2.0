import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Screens } from "../../../themes";
import { dateTime } from "../../../utils/encryption";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { LocalImages } from "../../../constants/imageUrlConstants";
import Header from "../../../components/Header";
import {
  createUserSignature,
  saveDocuments,
} from "../../../redux/actions/authenticationAction";

const Accounts = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useAppDispatch();
  const [bankdata, setBankDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [accessTokenNew, setAccessTokenNew] = useState(null);
  const documentsDetailsList = useAppSelector((state) => state.Documents);
  const { accounts } = props.route.params;


  const createVerifiableCred = (balance) => {
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
      amount:balance[0]?.Amount?.Amount+"",
      // docType: verifyVcCred?.type[1],
      docExt: ".jpg",
      processedDoc: "",
      isVc: true,
      vc: JSON.stringify(balance),
      verifiableCredential: balance,
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
        Alert.alert("Proof of funds successfully generated");
        props.navigation.navigate("Documents");
      }, 1000);
    });
  };

  const _toggleDrawer = () => {
    props.navigation.openDrawer();
  };
  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', padding: 10 }}>
      <Text>{`Account ID: ${item.AccountId}`}</Text>
      <Text>{`Status: ${item.Status}`}</Text>
      <Text>{`Currency: ${item.Currency}`}</Text>
      {/* Add more fields as needed */}
      {item.Account && (
        <View style={{ marginVertical: 10 ,backgroundColor:'#9EDCF0',padding:10,borderRadius:20}}>
          <Text style={{ fontWeight: 'bold',color:'#000' }}>Account Details:</Text>
          {item.Account.map((subAccount, index) => (
            <View key={index}>
              <Text style={{color:'#000',fontSize:10}}>{`Scheme Name: ${subAccount.SchemeName}`}</Text>
              <Text style={{color:'#000',fontSize:10}}>{`Identification: ${subAccount.Identification}`}</Text>
              <Text style={{color:'#000',fontSize:10}}>{`Secondary Identification: ${subAccount.SecondaryIdentification}`}</Text>
            </View>
          ))}
        </View>
      )}
      {item.Balance && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Balance:</Text>
          {item.Balance.map((balance, index) => (
            <View key={index}>
              <Text>{`Type: ${balance.Type}`}</Text>
              <Text>{`Amount: ${balance.Amount.Amount} ${balance.Amount.Currency}`}</Text>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={()=>createVerifiableCred(item.Balance)}>
          <View
      
          >
            <View
              style={{
                width: 200,
                height: 50,
                backgroundColor: Screens.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                borderRadius:30,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOpacity: 0.8,
                elevation: 6,
                shadowRadius: 15 ,
                shadowOffset : { width: 1, height: 13},
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Generate Proof of Funds
              </Text>
            </View>
          </View>
        </TouchableOpacity>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
       <Header
            // rightIconPress={onPressNavigateTo}
            leftIconSource={LocalImages.logoImage}
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={"red"}></ActivityIndicator>
        </View>
      ) : (
        <FlatList
        data={accounts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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

export default Accounts;
