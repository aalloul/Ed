import React from 'react';
import glamorous from 'glamorous';

const mediaQueries = {
	phone: '@media only screen and (max-width: 1000px)',
}

const Wrapper = glamorous.section({
  backgroundColor: '#e9ebee',
  padding: '30px 0',
});

const Review = glamorous.div({
  backgroundColor: 'rgb(250, 250, 250)',
  border: '1px solid rgb(206, 208, 212)',
  borderRadius: '3px',
  width: '600px',
  padding: '10px',
  margin: '10px',
  font: 'SF Optimized, system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif',
  color: '#1d2129',
  display: 'inline-block',
  [mediaQueries.phone]: {
    width: '90%',
  },
});

const ReviewHeader = glamorous.div({
  display: 'inline-block',
});

const PhotoWrapper = glamorous.div({
  position: 'relative',
  display: 'inline-block',
});

const Photo = glamorous.img({
  width: '40px',
  height: '40px',
  border: '0px',
  borderRadius: '100%',
});

const ReviewNameWrapper = glamorous.div({
  overflow: 'hidden',
  display: 'inline-block',
});

const ReviewNameHeader = glamorous.div({
  marginLeft: '0px',
  marginBottom: '2px',
  paddingLeft: '8px',
  fontSize: '14px',
  fontWeight: 'normal',
  lineHeight: '1.38',
  color: '#1d2129',
  verticalAlign: 'middle',
});

const ReviewAuthor = glamorous.span({

});

const ReviewAuthorLink = glamorous.a({
  color: '#365899',
  textDecoration: 'none',
  paddingLeft: '2px',
  ':hover': {
    textDecoration: 'underline',
  },
})

const Grade = glamorous.i({
  color: '#ffffff',
  background: 'url(https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/eUXrUI9o3wq.png) -25px -85px',
  fontStyle: 'normal',
  backgroundSize: '81px 100px',
  display: 'inline-block',
  fontSize: '10px',
  width: '24px',
  height: '14px',
  verticalAlign: '-2.9px',
  marginLeft: '5px',
});

const GradeStars = glamorous.u({
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: '1px',
  left: 'auto',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});

const ReviewDate = glamorous.a({
  fontSize: '12px',
  fontWeight: 'normal',
  display: 'block',
  color: '#90949c',
});

const Text = glamorous.p({
  fontSize: '24px',
  fontWeight: '300',
  letterSpacing: '0',
  lineHeight: '28px',
  margin: '0px',
});

export default () => (
  <Wrapper>
    <Review>
      <ReviewHeader>
        <PhotoWrapper>
          <Photo src="https://scontent-amt2-1.xx.fbcdn.net/v/t1.0-1/c28.28.345.345/s100x100/207922_106344616117483_4494958_n.jpg?oh=bbe6b9ae6fc66222586ec3ac9ac08885&oe=5AB52EF7"/>
        </PhotoWrapper>
        <ReviewNameWrapper>
          <ReviewNameHeader>
            <ReviewAuthor>
              <ReviewAuthorLink href="https://www.facebook.com/ivan.grifins?hc_ref=ARRJoAcF67qnEZxz0yBYfTu3Ps9e7_K885iEc-VU1dgcQIWEyg65SORyONmY7Rex-DI">
                Pavik Kiselev
              </ReviewAuthorLink>
              reviewed
              <a>Growity</a>
              —
              <Grade>
                <GradeStars>5 stars</GradeStars>
              </Grade>
            </ReviewAuthor>
            <ReviewDate>31 May</ReviewDate>
          </ReviewNameHeader>
        </ReviewNameWrapper>
      </ReviewHeader>

      <Text>I find most of the posts very useful, thanks guys for doing this!</Text>
    </Review>
  </Wrapper>
);