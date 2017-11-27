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
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <EmailForm
          onInput={email => this.props.changeEmail(email)}
          onPress={() => navigate('Success')}
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
