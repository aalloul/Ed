import React, { Fragment } from 'react';
import glamorous from 'glamorous';

const Header = glamorous.header({
  width: '100%',
  background: '#172438',
  padding: '5px 0',
  display: 'flex',
  justifyContent: 'space-between',
});

const Logo =  glamorous.div({
  textAlign: 'center',
})

const Menu =  glamorous.div({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-around',
  width: '50%',
  alignItems: 'center',
})

const MenuItem = glamorous.a({
  color: '#fff',
  cursor: 'pointer',
})

export default () => (
  <Fragment>
    <script dangerouslySetInnerHTML={{
      __html: `
        <script type="text/javascript">
          (function(d) {
            var g = d.createElement('script');
            g.type = 'text/javascript';
            g.src = d.location.protocol + '//s.growity.me/cj76v2o9cwapc0131tqxxfn57.js';
            d.head.appendChild(g);
          })(document);
        </script>
      `
    }}>
    </script>
    <Header>
      <Logo>
        <img src="/img/smail_logo.png" width="100" />
      </Logo>
      <Menu>
        <MenuItem>Top</MenuItem>
        <MenuItem>How it works</MenuItem>
        <MenuItem>Reviews</MenuItem>
        <MenuItem>Pricing</MenuItem>
        <MenuItem>Contact</MenuItem>
      </Menu>
    </Header>
  </Fragment>
);