import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Image } from 'react-native';

import ActionButton from 'react-native-action-button';

const styles = StyleSheet.create({
  fabIcon: {
    height: 40,
    width: 40,
  },
  fabButton: {
    borderColor: "#fff",
    borderWidth: 3,
    borderStyle: "solid",
  },
});

const DisabledButton = ({ buttonProps, onPress, iconSource, iconStyle, loading }) => (
  <ActionButton
    buttonColor="#555"
    icon={<ActivityIndicator size="large" color="#00ff00" />}
    position="center"
    {...buttonProps}
  />
);

const ActiveButton =  ({ buttonProps, onPress, iconSource, iconStyle, loading }) => (
  <ActionButton
    buttonColor="rgba(80, 210, 194, 1)"
    icon={<Image source={iconSource} style={[styles.fabIcon, iconStyle]} />}
    onPress={onPress}
    position="center"
    {...buttonProps}
  />
);

const RoundButton = (props) => {
  return props.loading
    ? <DisabledButton {...props} />
    : <ActiveButton {...props} />
};

RoundButton.displayName = 'RoundButton';

RoundButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  iconSource: PropTypes.number.isRequired,
  iconStyle: PropTypes.object,
  buttonProps: PropTypes.object,
  loading: PropTypes.bool,
};

RoundButton.defaultProps = {
  iconStyle: {},
  buttonProps: {},
  loading: false,
};

export default RoundButton;