import React from 'react'
import { Router, Link } from 'react-static'

import Routes from 'react-static-routes'

import './app.css'

export default () => (
  <Router>
    <div className="content">
      <Routes />

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
  </Router>
)
