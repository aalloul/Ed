import React from 'react';
import glamorous from 'glamorous';

const Footer = glamorous.footer({
  width: '100%',
  background: '#171838',
  textAlign: 'center',
  padding: '30px 0px',
  display: 'flex',
  justifyContent: 'space-between',
});

const ContactWrapper = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

const ContactItem = glamorous.p({
  color: '#ffff',
  margin: '0px',
  padding: '0px 5px',
  textAlign: 'left',
})

const AmsterdamLogo = glamorous.p({
  color: '#ffff',
  margin: '0px',
  verticalAlign: 'middle',
})

const Icon = glamorous.img({
  padding: '0px 5px',
  width: "10",
  height: "30",
});

export default () => (
  <Footer>
    <ContactWrapper>
      <ContactItem>www.smail.rocks</ContactItem>
      <ContactItem>smail.app.rocks@gmail.com</ContactItem>
    </ContactWrapper>
    <AmsterdamLogo>
      <Icon src="img/icon-amsterdam.svg"   alt='Icon'/>
    Made in Amsterdam
    </AmsterdamLogo>
    <ul className="social-media">
      <li>
        <a href="https://fb.me/smailrocks" target="_blank">
          <i className="fa fa-facebook-official">Smail.rocks Facebook</i>
        </a>
      </li>
    </ul>
  </Footer>
);