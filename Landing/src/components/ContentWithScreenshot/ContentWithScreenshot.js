import glamorous from 'glamorous';

const mediaQueries = {
	phone: '@media only screen and (max-width: 1000px)',
}

export default glamorous.div({
  alignItems:  'center',
  display:  'flex',
  flexDirection:  'column',
  justifyContent:  'center',
  maxWidth:  '650px',
  textAlign:  'center',
  [mediaQueries.phone]: {
    maxWidth: '1000px',
    margin: '0px 20px',
  },
});
