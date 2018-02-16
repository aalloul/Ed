import React from 'react';

import HiwStep from '../../components/HiwStep/HiwStep';

export default () => (
  <section className="hiw" id="how-it-works">
    <HiwStep
      number="01"
      title="Take a picture"
      type="scan"
      reverse
    >
      Take a picture of the letter you want to convert to email
    </HiwStep>

    <HiwStep
      number="02"
      title="Choose a language"
      type="translation"
    >
      Choose the language to which you want to translate the letter.<br/>
      You can choose human translation, if automatic is not enough for you.
    </HiwStep>

    <HiwStep
      number="03"
      title="Enter an email"
      type="email"
      reverse
    >
      Enter your email to which you want us to send the translation.<br/>
      You can connect your Google Account if you wish.
    </HiwStep>
  </section>
)