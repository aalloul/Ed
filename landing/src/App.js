import React from 'react';
import Home from './routes/Home';
import Footer from './containers/Footer/Footer';

export default props => (
  <React.Fragment>
    <title>{props.title}</title>

    <style dangerouslySetInnerHTML={{
      __html: 'body { margin: 0; padding: 0; font-family: "Lato", sans-serif; font-size: 15px; background: #f5f2f1; color: #714f4f; -webkit-font-smoothing: antialiased; }'
    }} />

    <div className="content">
      <Home />

      <Footer />
    </div>
  </React.Fragment>

)
