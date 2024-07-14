import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LocalImages } from "../../../constants/imageUrlConstants";
import Header from "../../../components/Header";
//import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";


const BankLoginScreen = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { accounts } = props.route.params;
  //const rnBiometrics = new ReactNativeBiometrics();

  // useEffect(() => {
  //   rnBiometrics.isSensorAvailable()
  //     .then((resultObject) => {
  //       const { available, biometryType } = resultObject;
  //       if (available) {
  //         rnBiometrics.simplePrompt({ promptMessage: 'Confirm Biometric' })
  //           .then((resultObject) => {
  //             const { success } = resultObject;
  //             if (success) {
  //               props.navigation.navigate('Accountszzz', { accounts: accounts });
  //             } else {
  //               console.log('User cancelled biometric prompt');
  //             }
  //           })
  //           .catch(() => {
  //             console.log('Biometrics failed');
  //           });
  //       }
  //     })
  //     .catch(() => {
  //       console.log('Biometric sensor is not available');
  //     });
  // }, []);

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Username:', username);
    console.log('Password:', password);
    if(username ===''){
      alert('Please enter username')
    }
    else if(password === ''){
      alert('Please enter password')
    }
    else{
      console.log('accounts',accounts)
      props.navigation.navigate('Accountszzz',{accounts:accounts})
    }
  
    // Add logic to validate credentials and navigate to the next screen if successful
  };


  const _toggleDrawer = () => {
    props.navigation.openDrawer();
  };


  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
        <Header
            // rightIconPress={onPressNavigateTo}
            leftIconSource={LocalImages.logoImage}
            onpress={() => {
              _toggleDrawer();
            }}
            linearStyle={styles.linearStyle}
          ></Header>
    <View style={styles.container}>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#000"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#000"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  marginTop:30,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 10,
    color:'#000'
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BankLoginScreen;
