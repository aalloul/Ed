import React from 'react';
import glamorous from 'glamorous';

import Button from '../../components/Button/Button';

const Wrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '70px',
  width: '100%',
});

const Icon = glamorous.img({
  float: 'left',
  height: '38px',
  margin: '20px 15px 20px 0',
});

export default () => (
  <Wrapper>
    <Button href="#">
      <Icon src="/img/icon-appstore1.svg" alt="Icon" />
      APP STORE
    </Button>
    <Button href="#">
      <Icon src="/img/icon-googleplay1.svg" alt="Icon" />
      GOOGLE PLAY
    </Button>
  </Wrapper>
)