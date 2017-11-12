import React from 'react';
import { StyleSheet, View } from 'react-native';

import ChooseEmail from '../../components/ChooseEmail/ChooseEmail';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class EmailScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ChooseEmail
          onPress={() => navigate('Success')}
        />
      </View>
    );
  }
}
