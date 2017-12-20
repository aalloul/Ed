import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    fontSize: 24,
    marginBottom: 25,
    marginTop: 25,
    opacity: 0.5,
    textAlign: 'center',
  },
});

const DividerText = ({ children }) => (
  <Text style={styles.text}>
    {children}
  </Text>
);

DividerText.displayName = 'DividerText';

export default DividerText;