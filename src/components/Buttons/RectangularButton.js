import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';

const RectangularButton = ({ onPress, title, accessibilityLabel, style }) => (
  <Button
    accessibilityLabel={accessibilityLabel}
    color="#50D2C2"
    onPress={onPress}
    style={style}
    title={title}
  />
);

RectangularButton.displayName = 'RectangularButton';

RectangularButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  accessibilityLabel: PropTypes.string.isRequired,
  style: PropTypes.object,
};

RectangularButton.defaultProps = {
  style: null,
};

export default RectangularButton;