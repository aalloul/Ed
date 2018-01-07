import React from 'react';
import glamorous from 'glamorous';

const Footer = glamorous.footer({
  width: '100%',
  background: '#171838',
  padding: '30px 0',
});

const FooterWrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '80%',
  margin: '0 auto',
});

const Credits = glamorous.div({
  flex: '1 1 auto',
  display: 'block',
});

const Anchor = glamorous.a({
  color: '#FFF',
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

const Icon = glamorous.img({
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
        <Anchor href="/privacy-policy">Privacy Policy</Anchor>
      </Credits>
      <SocialList className="social-media">
        <SocialListItem>
          <Anchor href="https://fb.me/smailrocks" target="_blank">
            <Icon src="/img/facebook.svg" alt="Icon" />
            <span>Smail.rocks Facebook Group</span>
          </Anchor>
        </SocialListItem>
      </SocialList>
    </FooterWrapper>
  </Footer>
);