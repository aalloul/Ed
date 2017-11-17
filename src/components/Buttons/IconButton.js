import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#50D2C2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    width: 30,
  },
  title: {
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Avenir',
  }
});

const IconButton = ({ onPress, buttonStyle, iconSource, iconStyle, title, price, titleStyle }) => (
  <TouchableHighlight onPress={onPress}>
    <View style={[styles.button, buttonStyle]}>
      <Image style={[styles.icon, iconStyle]} source={iconSource} />
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.title, titleStyle]}>{price}</Text>
    </View>
  </TouchableHighlight>
);

IconButton.displayName = 'IconButton';

IconButton.propTypes = {

};

IconButton.defaultProps = {
  btnStyle: {},
  iconStyle: {},
  titleStyle: {},
};

export default IconButton;

