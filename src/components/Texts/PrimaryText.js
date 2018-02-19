import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: win.height < 600 ? 24 : 32,
  },
});

const PrimaryText = ({ children }) => (
  <Text style={styles.text}>
    {children}
  </Text>
);

PrimaryText.displayName = 'PrimaryText';

export default PrimaryText;