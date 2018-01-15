import React from 'react';
import glamorous from 'glamorous';

import Buttons from '../Buttons/Buttons';

const mediaQueries = {
	phone: '@media only screen and (max-width: 1000px)',
}

const Wrapper = glamorous.section({
  background: 'url("/img/cloud_image.jpg") center top no-repeat',
  padding: '350px 0 250px',
});

const Item = glamorous.div({
  margin: '0 auto',
  textAlign: 'center',
  width: '800px',
});

const Price = glamorous.h2({
  fontSize: '60px',
  color: '#844728',
  mixBlendMode: 'difference',
});

const Trial = glamorous.ul({
  fontSize: '48px',
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: '125px',
});
  
const Condition = glamorous.li({
  display: 'inline',
  fontSize: '24px',
});

export default () => (
  <Wrapper>
    <Item>
      <Price>€5 per month</Price>

      <Trial>
        <Condition>First letter is free trial</Condition>
        <Condition>No credit card required</Condition>
        <Condition>Cancel anytime</Condition>
      </Trial>

      <Buttons />
    </Item>
  </Wrapper>
);