import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import Camera from 'react-native-camera';

import RoundButton from '../../components/Buttons/RoundButton';
import { takePhoto } from '../../actions/index';

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

class ScanScreen extends React.Component {
  constructor() {
    super();

    this.scan = this.scan.bind(this);
  }

  scan() {
    const { navigation, takePhoto } = this.props;

    navigation.navigate('Translation');

    return; // TODO for development only, DO NOT MERGE

    const options = {};
    //options.location = ...
    this.camera
      .capture({ metadata: options })
      .then((data) => {
        // @property {String} data.path: Returns the path of the captured image or video file on disk
        console.log(data);

        takePhoto(data);
        navigation.navigate('Translation');
      })
      .catch(err => console.error(err));
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
            <Text style={styles.text}>List of scanned letters goes here</Text>
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

export default connect(null, dispatch => ({
  takePhoto(photo) {
    dispatch(takePhoto(photo))
  }
}))(ScanScreen);
