import React from 'react';
import glamorous from 'glamorous';
import mediaQueries from '../../common/mediaQueries';
import consts from '../../components/consts';

const Header = glamorous.header({
  width: '100%',
  background: '#172438',
  padding: '5px 0',
  display: 'flex',
  justifyContent: 'space-between',
});

const Logo =  glamorous.div({
  textAlign: 'center',
});

const Menu =  glamorous.ul({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-around',
  width: '50%',
  alignItems: 'center',
  [mediaQueries.phone]: {
    flexDirection: 'column',
    position: 'absolute',
    width: '200px',
    margin: '-100px 0 0 0',
    padding: '50px',
    paddingTop: '125px',
    right: '-100px',
    background: '#50D2C2',
    listStyleType: 'none',
    transformOrigin: '0% 0%',
    transform: 'translate(100%, 0)',
    transition: 'transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0)',
  },
});

const MenuItem = glamorous.a({
  color: '#fff',
  cursor: 'pointer',
  [mediaQueries.phone]: {
    marginTop: '20px',
    fontSize: '30px',
    width: '100%',
  }
});

const Navigation = glamorous.nav({
  width: '50%',
});

const MenuToggle = glamorous.div({
  [mediaQueries.phone]: {
    display: 'block',
    position: 'absolute',
    top: '15px',
    right: '50px',
    zIndex: '1',
  }
});

const Checkbox = glamorous.input({
  display: 'none',
[mediaQueries.phone]: {
  display: 'block',
  width: '40px',
  height: '32px',
  position: 'absolute',
  top: '-7px',
  left: '-5px',
  cursor: 'pointer',
  opacity: '0',
  zIndex: '2', 
  ':checked ~ span': {
    opacity: '1',
    transform: 'rotate(45deg) translate(-2px, -1px)',
  },
  ':checked ~ span:nth-last-child(3)': {
      opacity: '0',
      transform: 'rotate(0deg) scale(0.2, 0.2)',
  },
  ':checked ~ span:nth-last-child(2)': {
      opacity: '1',
      transform: 'rotate(-45deg) translate(0, -1px)',
  },
  ':checked ~ ul': {
    transform: 'scale(1.0, 1.0)',
    opacity: '1',
  },
}
});

const Dash = glamorous.span({
[mediaQueries.phone]: {
  display: 'block',
  width: '33px',
  height: '4px',
  marginBottom: '5px',
  position: 'relative',
  background: '#cdcdcd',
  borderRadius: '3px',
  zIndex: '1',
  transformOrigin: '4px 0px',
  transition: 'transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0)',
  transition: 'background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),',
  transition: 'opacity 0.55s ease',
  ':first-child': {
    transformOrigin: '0% 0%',
  },
  'nthLastChild(2)': {
    transformOrigin: '0% 100%',
  }
}
});


export default () => (
  <Header>
    <Logo>
      <img src="/img/smail_logo.png" width="100" alt="SMail app logotype (envelop with @ sign inside)" />
    </Logo>
    <Navigation>
      <MenuToggle>
        <Checkbox type='checkbox'/>
        <Dash/>
        <Dash/>
        <Dash/>
        <Menu>
          <MenuItem>Top</MenuItem>
          <MenuItem>How it works</MenuItem>
          <MenuItem>Reviews</MenuItem>
          <MenuItem>Pricing</MenuItem>
          <MenuItem>Contact</MenuItem>
        </Menu>
      </MenuToggle>
    </Navigation>
  </Header>
);