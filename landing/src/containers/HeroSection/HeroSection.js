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

const badgeSize = {
  height: 100,
  width: 100,
};

const commonBeforeAfterBadge = {
  ...badgeSize,
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  background: '#4ed3c0',
};

const commonBadge = {
  ...badgeSize,
  alignItems: 'center',
  background: '#4ed3c0',
  display: 'inline-block',
  margin: '0 auto',
  position: 'relative',
};

const Badge = glamorous.span({
  ...commonBadge,
  margin: '30px 30px 0',
  transform: 'rotate(-45deg)',
  ':before': {
    ...commonBeforeAfterBadge,
    transform: 'rotate(-15deg)',
  },
  ':after': {
    ...commonBeforeAfterBadge,
    transform: 'rotate(-30deg)',
  },
});

const BadgeInner = glamorous.span({
  ...commonBadge,
  display: 'inline-flex',
  justifyContent: 'center',
  transform: 'rotate(45deg)',
  zIndex: 2,
  ':before': {
    ...commonBeforeAfterBadge,
    transform: 'rotate(60deg)',
  },
  ':after': {
    ...commonBeforeAfterBadge,
    transform: 'rotate(75deg)',
  },
});

const BadgeText = glamorous.span({
  display: 'block',
  position: 'relative',
  textAlign: 'center',
  zIndex: 5,
});

export default () => (
  <Wrapper id="hero">
    <Screenshot type="success" />

    <Section>
      <Title>Tired of endless letters?</Title>
      <Text>Convert them to emails<br/>with automatic translation!</Text>
      <Text>Absolutely for
        <Badge><BadgeInner><BadgeText>FREE</BadgeText></BadgeInner></Badge>
      </Text>

      <Buttons />
    </Section>
  </Wrapper>
)
