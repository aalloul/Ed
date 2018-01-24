import React from 'react';
import { StaticRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './routes/Home';
import PrivacyPolicy from './routes/PrivacyPolicy';

import Footer from './containers/Footer/Footer';
import Header from './containers/Header/Header';
import Favicons from './containers/Favicons/Favicons';
import NotifyModal from './components/NotifyModal/NotifyModal';
import FbMessenger from './components/FbMessenger/FbMessenger';

const Router = typeof document !== 'undefined'
  ? BrowserRouter
  : StaticRouter;

export default props => (
  <React.Fragment>
    <title>{props.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={props.description} />

    <style dangerouslySetInnerHTML={{
    __html: 'body { margin: 0; padding: 0; font-family: "Lato", sans-serif; font-size: 15px; background: #f5f2f1; color: #714f4f; -webkit-font-smoothing: antialiased; }'
    }} />

    <Favicons />

    <style dangerouslySetInnerHTML={{
      __html: 'body { margin: 0; padding: 0; font-family: "Lato", sans-serif; font-size: 15px; background: #f5f2f1; color: #714f4f; -webkit-font-smoothing: antialiased; }'
    }} />

    <script dangerouslySetInnerHTML={{
      __html: `
        (function(d) {
          var g = d.createElement('script');
          g.type = 'text/javascript';
          g.src = d.location.protocol + '//s.growity.me/cj76v2o9cwapc0131tqxxfn57.js';
          d.head.appendChild(g);
        })(document);
      `
    }}>
    </script>

    <div className="content" style={{overflowX: 'hidden'}}>
      <Header />
      <Router
        basename={props.basename}
        location={props.pathname}
        context={context}
      >
        <Switch>
          <Route
            exact
            path='/'
            render={() => <Home {...props} />}
          />
          <Route
            path='/privacy-policy'
            render={() => <PrivacyPolicy {...props} />}
          />
        </Switch>
      </Router>

      <Footer />
    </div>

    <NotifyModal />
    <FbMessenger />
    
    <script dangerouslySetInnerHTML={{
      __html: `
      (function (window) {
        { 
          // browser
          var nVer = navigator.appVersion;
          var nAgt = navigator.userAgent;
    
          // mobile version
          var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
          
          if (mobile === false) {
            return;
          }

          // system
            var os = undefined;
            var clientStrings = [
                {s:'Android', r:/Android/},
                {s:'iOS', r:/(iPhone|iPad|iPod)/}
            ];

            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    os = cs.s;
                    break;
                }
            }
    
            if (/Windows/.test(os)) {
                os = 'Windows';
            }
        }
    
        window.jscd = {
            mobile: mobile,
            os: os,
        };
    }(this));

    if (jscd.mobile) {

    var buttonClass = '';
    if (jscd.os === 'iOS') {
      buttonClass = 'Android';
    } else if (jscd.os === 'Android') {
      buttonClass = 'iOS';
    }
    
    var buttons=document.getElementsByClassName(buttonClass);

    Object.values(buttons).forEach(function(item) {
      item.style.display = 'none';
    });
  };

    `}}>
    </script>
    <script dangerouslySetInnerHTML={{
      __html: `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-93678494-4', 'auto');
        ga('send', 'pageview');
      `}}
    >
    </script>
  </React.Fragment>
);

// This context object contains the results of the render
const context = {};
