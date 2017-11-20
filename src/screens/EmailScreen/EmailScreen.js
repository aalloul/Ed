import React from 'react';
import { StyleSheet, View } from 'react-native';

import EmailForm from '../../components/EmailForm/EmailForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class EmailScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      email: ''
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <EmailForm
          onInput={email => this.setState({ email })}
          onPress={() => navigate('Success')}
          email={this.state.email}
        />
      </View>
    );
  }
}
