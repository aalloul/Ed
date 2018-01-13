import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet, Image } from 'react-native';

import ActionButton from 'react-native-action-button';
import { enableButtonLoadingRoutine } from '../../actions/applicationActions';

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

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    if (!this.props.loading) {
      this.props.enableButtonLoading().then(this.props.onPress);
    }
  }

  getIcon() {
    const { iconSource, iconStyle } = this.props;

    return this.props.loading
      ? <ActivityIndicator size="large" color="#00ff00" />
      : <Image source={iconSource} style={[styles.fabIcon, iconStyle]} />
  }

  getColor() {
    return this.props.loading
      ? 'gray'
      : 'rgba(80, 210, 194, 1)';
  }

  render() {
    const { buttonProps } = this.props;

    return (
      <ActionButton
        buttonColor={this.getColor()}
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

const mapStateToProps = ({ application: { loading } }) => ({ loading });

const mapDispatchToProps = dispatch => ({
  enableButtonLoading() {
    return dispatch(enableButtonLoadingRoutine());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoundButton);