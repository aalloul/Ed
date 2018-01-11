import React, { Component } from 'react';
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

class RoundButton extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
    };

    this.handlePress = this.handlePress.bind(this);
  }

  disableLoading = () => {
    this.setState({ loading: false });
  };

  handlePress() {
    if (!this.state.loading) {
      this.setState({ loading: true }, () => this.props.onPress());
    }
  }

  getIcon() {
    const { iconSource, iconStyle } = this.props;

    return this.state.loading
      ? <ActivityIndicator size="large" color="#00ff00" />
      : <Image source={iconSource} style={[styles.fabIcon, iconStyle]} />
  }

  render() {
    const { buttonProps } = this.props;

    return (
      <ActionButton
        buttonColor="rgba(80, 210, 194, 1)"
        icon={this.getIcon()}
        onPress={this.handlePress}
        position="center"
        {...buttonProps}
      />
    );
  }
}

RoundButton.displayName = 'RoundButton';

RoundButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  iconSource: PropTypes.number.isRequired,
  iconStyle: PropTypes.object,
  buttonProps: PropTypes.object,
};

RoundButton.defaultProps = {
  iconStyle: {},
  buttonProps: {},
};

export default RoundButton;