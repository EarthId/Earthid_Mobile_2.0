import React, { useState, useEffect, useCallback } from "react";
import { AppRegistry, Text, View, Image, TouchableOpacity } from "react-native";
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";
const Share = () => {
  const [sharedData, setSharedData] = useState("");
  const [sharedMimeType, setSharedMimeType] = useState("");
console.log('sharedMimeType',sharedData)
  useEffect(() => {

    ShareMenuReactView.data().then(async ({ mimeType, data }) => {
   
      setSharedData(data[0]?.data);
      setSharedMimeType(data[0]?.mimeType);
    });
 
  }, []);
  const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {sharedMimeType === "application/pdf"  ? (
          <Image
            style={{ width: 300, height: 600, resizeMode: "contain" }}
            source={require("../../resources/images/pdf.svg.png")}
          />
        ) : (
          sharedMimeType ==='application/msword' || sharedMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'?
          <Image
          style={{ width: 300, height: 600, resizeMode: "contain" }}
          source={require("../../resources/images/word.png")}
        />:
          <Image
            style={{ width: 400, height: 600, resizeMode: "contain" }}
            source={{ uri: sharedData }}
          />
        )}
      </View>
      {sharedData !== "" && (
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              ShareMenuReactView.dismissExtension();
            }, 500);
            console.log('sharedData===>',sharedData)
        
            
            // Example: Generate a random string of length 8
            ShareMenuReactView.continueInApp({
              data: sharedData.toString(),
              mimeType: sharedMimeType,
              shareButton: generateRandomString(20)
            });
          
          }}
          style={{
            flex: 0.2,
            backgroundColor: "#007aff",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
            marginHorizontal: 30,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Share</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default Share;
