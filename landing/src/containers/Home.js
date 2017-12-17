import React from 'react'
import { getSiteProps } from 'react-static'
import Buttons from '../components/Buttons/Buttons';
import HiwStep from '../components/HiwStep/HiwStep';

export default getSiteProps(() => (
  <div>
    <section className="header">
      <div className="phone">
        <div className="mobile-frame mobile-frame--success" />
      </div>

      <div className="main">
        <h1 className="hero-title">Tired of endless letters?</h1>
        <h2 className="hero-text">Convert them to emails<br/>with automatic translation!</h2>

        <Buttons />
      </div>
    </section>

    <section className="hiw">
      <HiwStep
        number="01"
        title="Take a picture"
        afterContent={<div className="mobile-frame mobile-frame--scan" />}
      >
        Take a picture of the letter you want to convert to email
      </HiwStep>

      <HiwStep
        number="02"
        title="Choose a language"
        beforeContent={<div className="mobile-frame mobile-frame--translation" />}
      >
        Choose the language to which you want to translate the letter.<br/>
        You can choose human translation, if automatic is not enough for you.
      </HiwStep>

      <HiwStep
        number="03"
        title="Enter an email"
        afterContent={<div className="mobile-frame mobile-frame--email" />}
      >
        Enter your email to which you want us to send the translation.<br/>
        You can connect your Google Account if you wish.
      </HiwStep>
    </section>

    <footer className="footer transition">
      <div className="social-media">
        <li>
          <a href="https://fb.me/smailrocks" target="_blank">
            <i className="fa fa-facebook-official">Smail.rocks Facebook Group</i>
          </a>
        </li>
      </div>
    </footer>
  </div>
))
