import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 32,
  },
});

const PrimaryText = ({ children }) => (
  <Text style={styles.text}>
    {children}
  </Text>
);

PrimaryText.displayName = 'PrimaryText';

export default PrimaryText;