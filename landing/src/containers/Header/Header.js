import React from 'react';
import glamorous from 'glamorous';

import consts from '../../common/consts';

const Header = glamorous.header({
  background: '#172438',
  padding: '20px 20px 30px',
  display: 'flex',
  justifyContent: 'space-between',
});

const Logo =  glamorous.div({
  textAlign: 'center',
});

const Navigation = glamorous.nav();
const MenuToggle = glamorous.img({
  display: 'none',
  [consts.media.phone]: {
    display: 'block',
  },
});

const Menu = glamorous.ul({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  listStyleType: 'none',
  [consts.media.phone]: {
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '20px 0',
    margin: 0,
    background: '#50D2C2',

    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
  },
  '.menu-visible': {
    opacity: 1,
    pointerEvents: 'auto',
  },
});

const MenuItem = glamorous.li({
  paddingRight: '40px',
  [consts.media.phone]: {
    marginTop: '20px',
    padding: '0',
    width: '100%',
  },
});

const MenuLink = glamorous.a({
  color: '#fff',
  [consts.media.phone]: {
    fontSize: '30px',
    textDecoration: 'none',
  },
});

export default () => (
  <Header id="header">
    <Logo>
      <img src="/img/smail_logo.png" width="100" alt="SMail app logotype (envelop with @ sign inside)" />
    </Logo>
    <Navigation>
      <MenuToggle src="/img/icon-menu.png" id="menu-toggle" />

      <Menu id="menu">
        <MenuItem>
          <MenuLink href="#header">Top</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#how-it-works">How it works</MenuLink>
        </MenuItem>
        { /* <MenuItem> */ }
          { /* <MenuLink href="#pricing">Pricing</MenuLink> */ }
        { /* </MenuItem> */ }
        <MenuItem>
          <MenuLink href="#contact">Contact</MenuLink>
        </MenuItem>
      </Menu>
      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          var menu = document.getElementById('menu');
          var menuClassList = menu.classList;
          var menuToggle = document.getElementById('menu-toggle');
          var className = 'menu-visible';
          menuToggle.addEventListener('click', function(e) {
            if (!menuClassList.contains(className)) {
              e.stopPropagation();
              menuClassList.add(className);
            }
          });
          document.body.addEventListener('click', function() {
            menuClassList.remove(className);
          });
        })();
      `}}
      >
      </script>
    </Navigation>
  </Header>
);