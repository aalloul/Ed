import React from 'react';
import { StyleSheet, View, Modal, Text, Button, Image } from 'react-native';

import Camera from 'react-native-camera';

import TranslationModal from '../../components/TranslationModal/TranslationModal';
import EmailModal from '../../components/EmailModal/EmailModal';
import RoundButton from '../../components/Buttons/RoundButton';

export default class ScanScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      translationModal: false,
      emailModal: false,
    };

    this.scan = this.scan.bind(this);
  }

  scan() {
    this.props.navigate('Language');

    return; // TODO for development only, DO NOT MERGE

    const options = {};
    //options.location = ...
    this.camera
      .capture({ metadata: options })
      .then((data) => {
        // @property {String} data.path: Returns the path of the captured image or video file on disk
        console.log(data);

        this.showTranslationModal();
      })
      .catch(err => console.error(err));
  }

  showTranslationModal() {
    this.setState({
      translationModal: true,
      emailModal: false,
    });
  }

  showEmailModal() {
    this.setState({
      translationModal: false,
      emailModal: true,
    });
  }

  render() {
    const { navigate } = this.props.navigation;

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
              onPress={() => navigate('Language')}
            />
          </View>
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
