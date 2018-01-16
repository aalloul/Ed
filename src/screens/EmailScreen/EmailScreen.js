import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import EmailForm from '../../components/EmailForm/EmailForm';
import {
  changeEmail,
  requestTranslationRoutine
} from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationHelpers';
import { debounceTaps } from '../../common/commonHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class EmailScreen extends PureComponent {
  static navigationOptions = {
    title: "Your email",
    ...headerStyle,
  };

  constructor() {
    super();

    this.state = {
      errorText: '',
    };

    this.handlePress = debounceTaps(this.handlePress.bind(this));
    this.resetError = this.resetError.bind(this);
    this.setError = this.setError.bind(this);
  }

  setError() {
    this.setState({ errorText: 'Email is required' });
  }

  resetError() {
    this.setState({ errorText: '' });
  }

  handlePress() {
    const { email, requestTranslationRoutine } = this.props;

    if (email) {
      requestTranslationRoutine();
    } else {
      this.setError();
    }
  }

  render() {
    const { email, changeEmail } = this.props;

    return (
      <View style={styles.container}>
        <EmailForm
          onInput={email => changeEmail(email)}
          onPress={this.handlePress}
          email={email}
          errorText={this.state.errorText}
          resetError={this.resetError}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application: { email } }) => ({ email });

const mapDispatchToProps = dispatch => ({
  changeEmail(email) {
    dispatch(changeEmail(email));
  },
  requestTranslationRoutine() {
    dispatch(requestTranslationRoutine());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EmailScreen);
