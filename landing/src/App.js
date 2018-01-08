import React from 'react';
import { StaticRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './routes/Home';
import PrivacyPolicy from './routes/PrivacyPolicy';

import Footer from './containers/Footer/Footer';
import NotifyModal from './components/NotifyModal/NotifyModal';
import FbMessenger from './components/FbMessenger/FbMessenger';

const Router = typeof document !== 'undefined'
  ? BrowserRouter
  : StaticRouter;

// This context object contains the results of the render
const context = {};

export default props => (
  <React.Fragment>
    <title>{props.title}</title>

    <style dangerouslySetInnerHTML={{
      __html: 'body { margin: 0; padding: 0; font-family: "Lato", sans-serif; font-size: 15px; background: #f5f2f1; color: #714f4f; -webkit-font-smoothing: antialiased; }'
    }} />

    <div className="content">
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
