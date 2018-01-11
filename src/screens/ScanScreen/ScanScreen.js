import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import Camera from 'react-native-camera';

import RoundButton from '../../components/Buttons/RoundButton';
import { takePhotoRoutine } from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationOptions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 24,
    position: 'absolute',
    bottom: 100,
    left: 15,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
});

class ScanScreen extends Component {
  static navigationOptions = {
    title: "Take a picture",
    ...headerStyle,
  };

  constructor() {
    super();

    this.state = {
      loading: false,
    };

    this.scan = this.scan.bind(this);
  }

  scan() {
    this.setState({ loading: true });
    return this.props.takePhotoRoutine(this.camera)
      .then(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
          <View style={styles.camera}>
            {/* <Text style={styles.text}>List of scanned letters goes here</Text> */}
            {
              this.props.loading
                ? <Text style={styles.text}>Loading</Text>
                : <RoundButton
                    iconSource={require('./ScanIcon.png')}
                    onPress={this.scan}
                    loading={this.props.loading}
                  />
            }
          </View>
        </Camera>
      </View>
    );
  }
}

export default connect(null, dispatch => ({
  takePhotoRoutine(photo) {
    return dispatch(takePhotoRoutine(photo))
  }
}))(ScanScreen);
