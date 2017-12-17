import React from 'react'
import { Router, Link } from 'react-static'

import Routes from 'react-static-routes'

import './app.css'

export default () => (
  <Router>
    <div className="content">
      <Routes />
    </div>
  </Router>
)
