import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 24,
  },
});

const SecondaryText = ({ children }) => (
  <Text style={styles.text}>{children}</Text>
);

SecondaryText.displayName = 'SecondaryText';

export default SecondaryText;