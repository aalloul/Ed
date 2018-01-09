import React from 'react';
import glamorous from 'glamorous';

const Footer = glamorous.footer({
  width: '100%',
  background: '#171838',
  textAlign: 'center',
  padding: '30px 0px',
  display: 'flex',
  justifyContent: 'space-around',
});

const AmsterdamLogo = glamorous.p({
  color: '#ffff',
  margin: '0px',
  verticalAlign: 'middle',
})

const Icon = glamorous.img({
  padding: '0px 5px',
  width: "15",
  height: "45",
});

const FooterWrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  alignContent:  'flex-start',
  width: '90%',
  margin: '0px auto',
});

const Credits = glamorous.div({
  flex: '1 1 auto',
  display: 'block',
  alignItems: 'flex-start',
  textAlign: 'left',
});

const Anchor = glamorous.a({
  color: '#FFF',
  textAlign: 'left',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});

const SocialList = glamorous.ul({
  listStyleType: 'none',
  flex: '4 1 auto',
  padding: 0,
  margin: 0,
});

const Logo = glamorous.img({
  height: '24px',
  position: 'relative',
  top: '6px',
  right: '8px',
});

const SocialListItem = glamorous.li({
  textAlign: 'right',
});

export default () => (
  <Footer>
    <FooterWrapper>
      <Credits>
        <Anchor href="/">Smail.rocks</Anchor>
        <br />
        <Anchor href="mailto:smail.app.rocks@gmail.com">smail.app.rocks@gmail.com</Anchor>
        <br />
        <Anchor href="/privacy-policy">Privacy Policy</Anchor>
      </Credits>
    <AmsterdamLogo>
      <Icon src="img/icon-amsterdam.svg"   alt='Icon'/>
    Made in Amsterdam
    </AmsterdamLogo>
     
      <SocialList className="social-media">
        <SocialListItem>
          <Anchor href="https://fb.me/smailrocks" target="_blank">
            <Logo src="/img/facebook.svg" alt="Icon" />
            <span>Smail.rocks Facebook Group</span>
          </Anchor>
        </SocialListItem>
      </SocialList>
    </FooterWrapper>
  </Footer>
);