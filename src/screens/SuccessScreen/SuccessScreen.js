import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';

export default class SuccessScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <PrimaryText>
          Success!
        </PrimaryText>
        <Image source={require('./TickIcon.png')} style={styles.image} />
        <SecondaryText>
          <Text style={styles.bold}>English</Text> translation{"\n"}
          has been sent to{"\n"}
          <Text style={styles.bold}>paulcodiny@gmail.com</Text>
        </SecondaryText>
        <RectangularButton
          accessibilityLabel="Continue scanning the paper mails"
          onPress={() => navigate('Scan')}
          style={styles.bottom}
          title="Scan more"
        />
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
    height: '100%',
  },
  bold: {
    fontWeight: "bold",
  },
  image: {
    height: 115,
    marginBottom: 35,
    marginTop: 35,
    width: 150,
  },
  bottom: {
    alignSelf: 'flex-end',
  },
});
