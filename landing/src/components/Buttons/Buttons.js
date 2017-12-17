import React from 'react'

import IconAppStore from './img/icon-appstore1.svg'
import IconGooglePlay from './img/icon-googleplay1.svg'

export default () => (
  <div className="buttons">
    <a href="#" className="btn transition">
      <img src={IconAppStore} alt="Image" className="btn--icon btn--icon-appstore"/>
      APP STORE
    </a>
    <a href="#" className="btn transition">
      <img src={IconGooglePlay} alt="Image" className="btn--icon btn--icon-googleplay"/>
      GOOGLE PLAY
    </a>
  </div>
)