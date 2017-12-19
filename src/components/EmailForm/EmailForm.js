import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';

import GoogleSignIn from 'react-native-google-sign-in';

import PrimaryText from '../Texts/PrimaryText';
import IconButton from '../Buttons/IconButton';
import DividerText from '../Texts/DividerText';
import RoundButton from '../Buttons/RoundButton';

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

  GoogleSignIn
    .configure({
      // iOS
      //clientID: 'yourClientID',

      // what API you want to access on behalf of the user, default is email and profile
      //scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      shouldFetchBasicProfile: true,
    })
    .then(GoogleSignIn.signInPromise)
    .then((user) => {
      console.log('signed in user is ', user);
      // you can now call currentUserAsync()
    });
}

const EmailForm = ({ onPress, onInput, email }) => (
  <View style={styles.container}>
    <PrimaryText>
      Send{'\n'}
      to the email
    </PrimaryText>

    <RoundButton
      iconSource={require('./SendIcon.png')}
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
