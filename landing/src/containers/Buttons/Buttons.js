import React from 'react';
import glamorous from 'glamorous';

import Button from '../../components/Button/Button';
import consts from '../../common/consts';

const Wrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '70px',
  width: '100%',
  [consts.media.phone]: {
    flexDirection: 'column',
    margin: '20px auto 40px',
  },
});

const Icon = glamorous.img({
  float: 'left',
  height: '38px',
  margin: '20px 15px 20px 0',
});

export default () => (
  <Wrapper>
    <Button href="#" data-modal="notify-ios" data-growity="appstore-button" className="iOS">
      <Icon src="/img/icon-appstore1.svg" alt="Icon" />
      APP STORE
    </Button>
    <Button href="https://play.google.com/store/apps/details?id=com.smail.app.android" data-growity="google-play-button" target="_blank" className="Android">
      <Icon src="/img/icon-googleplay1.svg" alt="Icon"/>
      GOOGLE PLAY
    </Button>
  </Wrapper>
)