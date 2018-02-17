import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: win.height < 600 ? 18 : 24,
  },
});

const SecondaryText = ({ children }) => (
  <Text style={styles.text}>{children}</Text>
);

SecondaryText.displayName = 'SecondaryText';

export default SecondaryText;