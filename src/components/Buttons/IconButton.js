import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#50D2C2',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    width: 30,
  },
  title: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
    fontFamily: 'Avenir',
  }
});

const ContentView = ({ buttonStyle, iconSource, iconStyle, title, titleStyle, price }) => (
  <View style={[styles.button, buttonStyle]}>
    <Image style={[styles.icon, iconStyle]} source={iconSource} />
    <Text style={[styles.title, titleStyle]}>{title}</Text>
    {price ? <Text style={[styles.title, titleStyle]}>{price}</Text> : null}
  </View>
);

const IconButton = (props) => (
  props.loading
    ? <ContentView {...props} />
    : (
      <TouchableHighlight onPress={props.onPress}>
        <View>
          <ContentView {...props} />
        </View>
      </TouchableHighlight>
    )
);

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  btnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  iconSource: PropTypes.number.isRequired,
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onPress: PropTypes.func.isRequired,
  price: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  loading: PropTypes.bool,
};

IconButton.defaultProps = {
  btnStyle: {},
  iconStyle: {},
  price: '',
  titleStyle: {},
  loading: false,
};

export default IconButton;

