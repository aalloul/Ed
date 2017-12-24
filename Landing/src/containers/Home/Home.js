import React from 'react'
import { getSiteProps } from 'react-static'
import Buttons from '../../components/Buttons/Buttons';
import HiwStep from '../../components/HiwStep/HiwStep';

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

    <section className="price">
      <div className="price--item">
        <h2 className="price--price">€5 per month</h2>

        <ul className="price--trial">
          <li className="price--condition">First letter is free trial</li>
          <li className="price--condition">No credit card required</li>
          <li className="price--condition">Cancel anytime</li>
        </ul>

        <Buttons />
      </div>
    </section>

    <section className="reviews">
      <div className="reviews--block">
        <div className="reviews--header">
          <div className="reviews--photo--wraper">
            <img className="reviews--photo" src="https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-1/c28.28.345.345/s100x100/207922_106344616117483_4494958_n.jpg?oh=bbe6b9ae6fc66222586ec3ac9ac08885&oe=5AB52EF7"/>
          </div>
          <div className="reviews--name--wraper">
            <div className="reviews--name--header">
              <span className="reviews--name">
                <a className="reviews--name-link" href="https://www.facebook.com/ivan.grifins?hc_ref=ARRJoAcF67qnEZxz0yBYfTu3Ps9e7_K885iEc-VU1dgcQIWEyg65SORyONmY7Rex-DI">Pavik Kiselev </a>
                reviewed
                <a>Growity</a>
                —
                <i className="reviews--grade">
                  <u>5 stars</u>
                </i>
              </span>
              <span className="reviews--date">
                <a>31 May</a>
              </span>
            </div>
          </div>
        </div>
        <div className="reviews--text">
          <p>I find most of the posts very useful, thanks guys for doing this!</p>
        </div>
      </div>
    </section>
  </div>
))
