import React from 'react';
import glamorous from 'glamorous';

import Buttons from '../Buttons/Buttons';
import consts from '../../common/consts';

const Wrapper = glamorous.section({
  background: 'url("/img/cloud_image.jpg") center top no-repeat',
  padding: '350px 0 250px',
  [consts.media.phone]: {
    background: 'none',
    padding: '0 20px',
  },
});

const Item = glamorous.div({
  margin: '0 auto',
  textAlign: 'center',
  width: '800px',
  [consts.media.phone]: {
    width: '100%',
  },
});

const Price = glamorous.h2({
  fontSize: '60px',
  color: '#844728',
  mixBlendMode: 'difference',
  [consts.media.phone]: {
    fontSize: '40px',
  },
  [consts.media.tablet]: {
    fontSize: '50px',
  },
});

const Trial = glamorous.ul({
  fontSize: '48px',
  display: 'flex',
  justifyContent: 'space-evenly',
  margin: '125px auto 0px',
  padding: '0px',
  [consts.media.phone]: {
    flexDirection: 'column',
    marginTop: '20px',
  },
});
  
const Condition = glamorous.li({
  display: 'inline',
  fontSize: '24px',
  [consts.media.phone]: {
    fontSize: '30px',
  },
});

export default () => (
  <Wrapper id="pricing">
    <Item>
      <Price>€5 per month</Price>

      <Trial>
        <Condition>First month is free trial</Condition>
        <Condition>No credit card required</Condition>
        <Condition>Cancel anytime</Condition>
      </Trial>

      <Buttons />
    </Item>
  </Wrapper>
);

/*
буэ
Wrapper
  Item
    Price
      children=€5 per month
    Trial
      children=(
        Condition
          children=First month is free trial
        Condition
          children=No credit card required
        Condition
          children=Cancel anytime
      )

React.Experiment
  name="..."
  targeting=???
  audience
  ctr={() => (
    React.Fragment
      ...option 1
  )}
  exp

 */