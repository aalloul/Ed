import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, TouchableHighlight, ViewPropTypes } from 'react-native';

const styles = {
  title: {
    color: '#fff',
    fontSize: 22,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#50D2C2',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
};

const ActiveButton = ({ onPress, title }) => (
  <TouchableHighlight
    underlayColor="#4FC8B8"
    onPress={onPress}
    style={styles.button}
  >
    <Text style={styles.title}>{title}</Text>
  </TouchableHighlight>
);

const DisabledButton = ({ style }) => (
  <TouchableHighlight
    underlayColor="#4FC8B8"
    style={styles.button}
  >
    <ActivityIndicator size="large" color="#ffffff" />
  </TouchableHighlight>
);

const RectangularButton = (props) => {
  return props.loading
    ? <DisabledButton {...props} />
    : <ActiveButton {...props} />
};

RectangularButton.displayName = 'RectangularButton';

RectangularButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

RectangularButton.defaultProps = {
  style: null,
  loading: false,
};

export default RectangularButton;