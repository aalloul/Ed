import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import Camera from 'react-native-camera';

import RoundButton from '../../components/Buttons/RoundButton';
import { disableButtonLoading, enableButtonLoading, takePhotoRoutine } from '../../actions/applicationActions';

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

    this.scan = this.scan.bind(this);
  }

  componentDidMount() {
    this.props.disableButtonLoading();
  }

  scan() {
    this.props.takePhotoRoutine(this.camera);
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
          orientation="portrait"
        >
          <View style={styles.camera}>
            {/* <Text style={styles.text}>List of scanned letters goes here</Text> */}
            <RoundButton
              iconSource={require('./ScanIcon.png')}
              onPress={this.scan}
            />
          </View>
        </Camera>
      </View>
    );
  }
}

const mapStateToProps = ({ application: { loading } }) => ({ loading });

const mapDispatchToProps = dispatch => ({
  takePhotoRoutine(photo) {
    return dispatch(takePhotoRoutine(photo));
  },
  disableButtonLoading() {
    return dispatch(disableButtonLoading());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);
