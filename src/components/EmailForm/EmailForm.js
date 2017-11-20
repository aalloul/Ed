import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import PrimaryText from '../Texts/PrimaryText';
import IconButton from '../Buttons/IconButton';
import DividerText from '../Texts/DividerText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    color: '#999',
    fontSize: 24,
    height: 40,
    marginBottom: 30,
    textAlign: 'center',
    width: 260,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 120,
    width: 150,
  },
  icon: {
    height: 25,
    width: 25,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 0,
  },
});

function signIn() {
  console.log('sign in');

  GoogleSignin
    .configure({
      // what API you want to access on behalf of the user, default is email and profile
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      /* <FROM DEVELOPER CONSOLE> */ // only for iOS
      iosClientId: '',
      /* <FROM DEVELOPER CONSOLE> */ // client ID of type WEB for your server (needed to verify user ID and offline access)
      webClientId: '',
      // specifies a hosted domain restriction
      hostedDomain: '',
      // [Android] if you want to show the authorization prompt at each login
      forceConsentPrompt: false,
      // [Android] specifies an account name on the device that should be used
      accountName: '',
    })
    .then(() => {
      // you can now call currentUserAsync()
    });
}

const EmailForm = ({ onPress, onInput, email }) => (
  <View style={styles.container}>
    <PrimaryText>
      Send{'\n'}
      to the email
    </PrimaryText>

    <GoogleSigninButton
      style={{ width: 260, height: 48, marginTop: 30,  }}
      size={GoogleSigninButton.Size.Standard}
      color={GoogleSigninButton.Color.Light}
      onPress={signIn}
    />

    <DividerText>
      or
    </DividerText>

    <TextInput
      keyboardType="email-address"
      onChangeText={onInput}
      placeholder="Email"
      style={styles.input}
      value={email}
    />

    <IconButton
      onPress={onPress}
      buttonStyle={styles.button}
      iconSource={require('./SendIcon.png')}
      iconStyle={styles.icon}
      title="Send"
      titleStyle={styles.title}
    />
  </View>
);

EmailForm.displayName = 'EmailForm';

EmailForm.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default EmailForm;
