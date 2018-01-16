import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import Camera from 'react-native-camera';

import RoundButton from '../../components/Buttons/RoundButton';
import { takePhotoRoutine } from '../../actions/applicationActions';

import { debounceTaps } from '../../common/commonHelpers';
import { headerStyle } from '../../common/navigationHelpers';

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

class ScanScreen extends PureComponent {
  static navigationOptions = {
    title: "Take a picture",
    ...headerStyle,
  };

  constructor() {
    super();

    this.scan = debounceTaps(this.scan.bind(this));
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

const mapDispatchToProps = dispatch => ({
  takePhotoRoutine(camera) {
    return dispatch(takePhotoRoutine(camera));
  },
});

export default connect(null, mapDispatchToProps)(ScanScreen);
