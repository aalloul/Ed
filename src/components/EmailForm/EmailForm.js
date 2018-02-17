import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';

import GoogleSignIn from 'react-native-google-sign-in';

import PrimaryText from '../Texts/PrimaryText';
import IconButton from '../Buttons/IconButton';
import DividerText from '../Texts/DividerText';
import { debounceTaps } from '../../common/commonHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  signInButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 250,
  },
  signInIcon: {
    height: 45,
    width: 45,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 5,
  },
  signInTitle: {
    color: '#999',
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    paddingRight: 50,
  },
  input: {
    color: '#999',
    fontSize: 24,
    height: 50,
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

function createSignIn(onInput, onPress) {
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
        // user: {
        //   userID: String,
        //   email: String,
        //   name: String,
        //   givenName: String,
        //   familyName: String,
        //   photoUrlTine: String,
        //   accessToken: String,
        //   idToken: null, ?
        //   accessibleScopes: String[],
        //   serverAuthCode: String,
        // }

        console.log('signed in user is ', user);

        // set user email
        onInput(user.email);
        onPress();
      });
  }

  return debounceTaps(signIn);
}

const renderError = (errorText) => {
  if (errorText) {
    return <Text>{errorText}</Text>;
  }
};

const EmailForm = ({ onPress, onInput, errorText, resetError, email }) => (
  <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={0} behavior="padding">
    <PrimaryText>
      Where should we send{'\n'}
      the translation
    </PrimaryText>

    {/*<IconButton*/}
      {/*onPress={createSignIn(onInput, onPress)}*/}
      {/*buttonStyle={styles.signInButton}*/}
      {/*iconSource={require('./GoogleIcon.png')}*/}
      {/*iconStyle={styles.signInIcon}*/}
      {/*title="Sign In"*/}
      {/*titleStyle={styles.signInTitle}*/}
    {/*/>*/}

    {/*<DividerText>*/}
      {/*or*/}
    {/*</DividerText>*/}

    <TextInput
      keyboardType="email-address"
      onChangeText={onInput}
      onFocus={resetError}
      placeholder="Email"
      style={styles.input}
      value={email}
    />

    { renderError(errorText) }

    <IconButton
      onPress={onPress}
      buttonStyle={styles.button}
      iconSource={require('./SendIcon.png')}
      iconStyle={styles.icon}
      title="Send"
      titleStyle={styles.title}
    />
  </KeyboardAvoidingView>
);

EmailForm.displayName = 'EmailForm';

EmailForm.propTypes = {
  onPress: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

EmailForm.defaultProps = {
  errorText: '',
};

export default EmailForm;
