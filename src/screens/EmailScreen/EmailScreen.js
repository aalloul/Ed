import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import EmailForm from '../../components/EmailForm/EmailForm';
import { changeEmail, requestTranslationRoutine } from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationOptions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class EmailScreen extends Component {
  static navigationOptions = {
    title: "Input your email",
    ...headerStyle,
  };

  constructor() {
    super();

    this.send = this.send.bind(this);
  }

  send() {
    this.props.requestTranslationRoutine();
  }

  render() {
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
  ({ application }) => ({
    email: application.email,
  }),
  dispatch => ({
    changeEmail(email) {
      dispatch(changeEmail(email));
    },
    requestTranslationRoutine() {
      dispatch(requestTranslationRoutine());
    },
  })
)(EmailScreen);
