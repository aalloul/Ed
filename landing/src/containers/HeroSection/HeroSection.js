import React from 'react'
import glamorous from 'glamorous';

import Buttons from '../Buttons/Buttons';
import Section from '../../components/ContentWithScreenshot/ContentWithScreenshot';
import Screenshot from '../../components/Screenshot/Screenshot';

const Wrapper = glamorous.section({
  background: '#172438',
  display: 'flex',
  position: 'relative',
  transitionDelay: '0.7s',
  textAlign: 'center',
  justifyContent: 'space-evenly',
});

const Title = glamorous.h2({
  color: '#fff',
  fontSize: '60px',
  fontWeight: '700',
  position: 'relative',
  margin: '0 auto',
});

const Text = glamorous.p({
  width: '80%',
  color: '#fff',
  fontSize: '40px',
  fontWeight: '700',
  position: 'relative',
  margin: '30px auto 0',
});

const WithBadge = glamorous.span({
    background: 'url(/img/badge.png) center no-repeat',
    backgroundSize: 'contain',
    display: 'inline-block',
    height: 150,
    lineHeight: '140px',
    margin: '0 auto',
    textAlign: 'center',
    width: 140,
});

export default () => (
  <Wrapper id="hero">
    <Screenshot type="success" />

    <Section>
      <Title>Tired of endless letters?</Title>
      <Text>Convert them to emails<br/>with automatic translation!</Text>
      <Text>Absolutely for <WithBadge>FREE</WithBadge></Text>

      <Buttons />
    </Section>
  </Wrapper>
)
