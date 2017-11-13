import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';

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

const RoundButton = ({ onPress, iconSource }) => (
  <ActionButton
    buttonColor="rgba(80, 210, 194, 1)"
    icon={<Image source={iconSource} style={styles.fabIcon} />}
    onPress={onPress}
    position="center"
    style={styles.fabButton}
  />
);

RoundButton.displayName = 'RoundButton';

RoundButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  iconSource: PropTypes.object.isRequired,
};

export default RoundButton;