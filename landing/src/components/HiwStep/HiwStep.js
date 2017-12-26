import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Buttons from '../../containers/Buttons/Buttons';
import ContentWithScreenshot from '../ContentWithScreenshot/ContentWithScreenshot';
import Screenshot from '../Screenshot/Screenshot';

const Wrapper = glamorous.div(({ reverse }) => ({
  display:  'flex',
  justifyContent:  'space-evenly',
  padding:  '30px 0',
  flexDirection: reverse ? 'row-reverse' : 'row',
}));

const Title = glamorous.h3({
  fontSize:  '50px',
  fontWeight:  '900',
  position:  'relative',
  marginBottom:  '40px',
});

const Text = glamorous.p({
  fontSize:  '36px',
  position:  'relative',
});

const Number = glamorous.span({
  color:  '#77778c',
  fontSize:  '100px',
  opacity:  '.1',
  position:  'absolute',
  left:  '-85px',
  top:  '-60px',
});

const HiwStep = ({ number, title, type, reverse, children }) => (
  <Wrapper reverse={reverse}>
    <Screenshot type={type} />

    <ContentWithScreenshot>
      <Title>
        <Number>{number}</Number>
        {title}
      </Title>
      <Text>
        {children}
      </Text>

      <Buttons />
    </ContentWithScreenshot>
  </Wrapper>
);

HiwStep.displayName = 'HiwStep';

HiwStep.propTypes = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
  children: PropTypes.any,
};

HiwStep.defaultProps = {
  reverse: false,
};

export default HiwStep;