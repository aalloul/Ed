import React from 'react';
import glamorous from 'glamorous';

import consts from '../../common/consts';

const Issues = glamorous.section({
  background: '#FFF',
  borderBottom: `2px ${consts.colors.main} solid`,
  color: consts.colors.main,
  fontFamily: 'Lato, sans-serif',
  paddingTop: 60,
  paddingBottom: 40,
  textAlign: 'center',
});

const Heading = glamorous.h3({
  fontSize: 45,
  fontWeight: '400',
  margin: 0,
  paddingBottom: 40,
});

const AdvantageWrapper = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
});

const Advantage = glamorous.div({
  flexBasis: '300px',
  margin: '0 40px 40px'
});

const AdvantageIcon = glamorous.img({
  width: 100,
  marginBottom: 20,
});

const AdvantageText = glamorous.div({
  fontSize: 30,
});



export default () => (
  <Issues>
    <Heading>SMail is for you if</Heading>
    <AdvantageWrapper>
      <Advantage>
        <AdvantageIcon src="img/icon-advantage-translate.svg" alt="Translate" />
        <AdvantageText>You need a translation of the physical mail</AdvantageText>
      </Advantage>
      <Advantage>
        <AdvantageIcon src="img/icon-advantage-work.svg" alt="Work" />
        <AdvantageText>It takes too much time to organize the mails</AdvantageText>
      </Advantage>
      <Advantage>
        <AdvantageIcon src="img/icon-advantage-notifications.svg" alt="Notifications" />
        <AdvantageText>Sometimes you forget to pay taxes and bills</AdvantageText>
      </Advantage>
    </AdvantageWrapper>
  </Issues>
);