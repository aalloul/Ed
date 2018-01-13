import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import EmailForm from '../../components/EmailForm/EmailForm';
import {
  changeEmail,
  disableButtonLoadingRoutine,
  enableButtonLoadingRoutine,
  requestTranslationRoutine
} from '../../actions/applicationActions';

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

  componentDidMount() {
    this.props.disableButtonLoading();
  }

  send() {
    this.props.enableButtonLoading()
      .then(this.props.requestTranslationRoutine);
  }

  render() {
    const { email, loading } = this.props;

    return (
      <View style={styles.container}>
        <EmailForm
          onInput={email => this.props.changeEmail(email)}
          onPress={this.send}
          email={email}
          loading={loading}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application }) => ({
  loading: application.loading,
  email: application.email,
});

const mapDispatchToProps = dispatch => ({
  changeEmail(email) {
    dispatch(changeEmail(email));
  },
  requestTranslationRoutine() {
    dispatch(requestTranslationRoutine());
  },
  enableButtonLoading() {
    return dispatch(enableButtonLoadingRoutine());
  },
  disableButtonLoading() {
    return dispatch(disableButtonLoadingRoutine());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EmailScreen);
