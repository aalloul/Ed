import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import EmailForm from '../../components/EmailForm/EmailForm';
import { changeEmail, sendLetter } from '../../actions/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class EmailScreen extends React.Component {
  constructor() {
    super();

    this.send = this.send.bind(this);
  }

  send() {
    fetch('https://linear-asset-184705.appspot.com/request_translation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.props.email,
        language: this.props.language,
        human_translation_requested: this.props.translation === 'human',
        image: '', // todo:palvik send picture, the device info, version and the user id
        timestamp: Date.now(),
        device: '',
        version: 1,
        user_id: '',
      }),
    })
      .then(response => response.json())
      .then(response => {
        // todo:pavlik check the error here
        this.props.navigation.navigate('Success');
      });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <EmailForm
          onInput={email => this.props.changeEmail(email)}
          onPress={this.send}
          email={this.props.email}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    language: state.language,
    translation: state.translation,
    email: state.email,
  }),
  dispatch => ({
    changeEmail(email) {
      dispatch(changeEmail(email));
    },
    sendLetter() {
      dispatch(sendLetter());
    },
  })
)(EmailScreen);
