import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import Camera from 'react-native-camera';
import ActionButton from 'react-native-action-button';

export default class ScanScreen extends React.Component {
  constructor() {
    super();

    this.scan = this.scan.bind(this);
  }

  scan() {
    console.log('go to scan screen');
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({ metadata: options })
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please scan the paper mail</Text>
        <Text style={styles.text}>List of scanned papers goes here</Text>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fit}
        >
          <ActionButton
            buttonColor="rgba(80, 210, 194, 1)"
            position="center"
            icon={<Image source={require('./ScanIcon.png')} style={styles.fabIcon} />}
            onPress={this.takePicture.bind(this)}
          />
        </Camera>
      </View>
    );
  }
} 

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
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  fabIcon: {
    height: 40,
    width: 40,
  },
});
