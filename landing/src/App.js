import React from 'react';
import { StaticRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './routes/Home';
import PrivacyPolicy from './routes/PrivacyPolicy';

import Footer from './containers/Footer/Footer';
import Header from './containers/Header/Header';
import Favicons from './containers/Favicons/Favicons';
import FbMessenger from './components/FbMessenger/FbMessenger';

const Router = typeof document !== 'undefined'
  ? BrowserRouter
  : StaticRouter;

export default props => (
  <React.Fragment>
    <title>{props.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={props.description} />

    <meta property="og:url" content="https://www.smail.rocks" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={props.title} />
    <meta property="og:description" content={props.description} />
    <meta property="og:image" content="https://www.smail.rocks/img/favicons/mstile-310x310.png" />
    <meta property="fb:app_id" content="524123631296536" />

    <Favicons />

    <style dangerouslySetInnerHTML={{
      __html: 'body { margin: 0; padding: 0; font-family: "Lato", sans-serif; font-size: 15px; background: #f5f2f1; color: #714f4f; -webkit-font-smoothing: antialiased; }'
    }} />

    <link id="g-css" href="https://s.growity.me/cjci7s8025dnc0124nr8nys2k.css" rel="stylesheet" />
    <script dangerouslySetInnerHTML={{
      __html: `
        (function(w, d, to) {
          var c = d.getElementById('g-css');
          if (!c) return;
          var t = w.setTimeout(function() { c.parentNode.removeChild(c); t = null; }, to);
          c.onload = function() { if (t) { w.clearTimeout(t); t = null; } }
        }(window, document, 2000));
      `
    }}>
    </script>
    <script async src="https://s.growity.me/cjci7s8025dnc0124nr8nys2k.js" />

    <div className="content">
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

    <FbMessenger />
    
    <script dangerouslySetInnerHTML={{
      __html: `
      (function (w) {
        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        if (mobile === false) {
          return;
        }

        // system
        var os = null;
        var clientStrings = [
          { s: 'Android', r: /Android/ },
          { s: 'iOS', r: /(iPhone|iPad|iPod)/ }
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

        w.jscd = {
          mobile: mobile,
          os: os,
        };

        if (w.jscd.mobile) {
          var buttonClass = '';
          if (w.jscd.os === 'iOS') {
            buttonClass = 'Android';
          } else if (w.jscd.os === 'Android') {
            buttonClass = 'iOS';
          }

          var buttons = document.getElementsByClassName(buttonClass);

          Object.values(buttons).forEach(function(item) {
            item.style.display = 'none';
          });
        }
      }(window));
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

        (function (d, w, c) {
            (w[c] = w[c] || []).push(function() {
                try {
                    w.yaCounter47652088 = new Ya.Metrika({
                        id:47652088,
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true
                    });
                } catch(e) { }
            });

            var n = d.getElementsByTagName("script")[0],
                s = d.createElement("script"),
                f = function () { n.parentNode.insertBefore(s, n); };
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://mc.yandex.ru/metrika/watch.js";

            if (w.opera == "[object Opera]") {
                d.addEventListener("DOMContentLoaded", f, false);
            } else { f(); }
        })(document, window, "yandex_metrika_callbacks");
      `}}
    >
    </script>
  </React.Fragment>
);

// This context object contains the results of the render
const context = {};
