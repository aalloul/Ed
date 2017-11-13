import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import RoundButton from '../Buttons/RoundButton';
import PrimaryText from '../Texts/PrimaryText';

function signIn() {
  console.log('sign in');

  GoogleSignin
    .configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      iosClientId: '',          /* <FROM DEVELOPER CONSOLE> */ // only for iOS
      webClientId: '',          /* <FROM DEVELOPER CONSOLE> */ // client ID of type WEB for your server (needed to verify user ID and offline access)
      hostedDomain: '',         // specifies a hosted domain restriction
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      accountName: '',          // [Android] specifies an account name on the device that should be used
    })
    .then(() => {
      // you can now call currentUserAsync()
    });
}

const ChooseEmail = ({ onPress }) => (
  <View>
    <PrimaryText>Send to the email</PrimaryText>

    <GoogleSigninButton
      style={{ width: 48, height: 48 }}
      size={GoogleSigninButton.Size.Icon}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />

    <RoundButton
      onPress={onPress}
      iconSource={require('./SendIcon.png')}
    />
  </View>
);

ChooseEmail.displayName = 'ChooseEmail';

ChooseEmail.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default ChooseEmail;
