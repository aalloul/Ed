import React, { Fragment } from 'react';

export default () => (
  <Fragment>
    <script dangerouslySetInnerHTML={{
      __html: `
        window.fbAsyncInit = function() {
          FB.init({
            appId            : '524123631296536',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.11'
          });
        };

        (function(d, s, id){
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement(s); js.id = id;
           js.src = "https://connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
         }(document, 'script', 'facebook-jssdk'));
      `
    }}>
    </script>
    <div className="fb-customerchat" page_id="384984215275845">
    </div>
  </Fragment>
);
