import React from 'react';
import glamorous from 'glamorous';

const Footer = glamorous.footer({
  width: '100%',
  background: '#171838',
  textAlign: 'center',
  padding: '30px 0',
});

export default () => (
  <Footer>
    <ul className="social-media">
      <li>
        <a href="https://fb.me/smailrocks" target="_blank">
          <i className="fa fa-facebook-official">Smail.rocks Facebook Group</i>
        </a>
      </li>
    </ul>
  </Footer>
);