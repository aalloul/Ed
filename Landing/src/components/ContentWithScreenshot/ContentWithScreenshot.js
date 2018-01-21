import glamorous from 'glamorous';
import mediaQueries from '../../common/mediaQueries';

export default glamorous.div({
  alignItems:  'center',
  display:  'flex',
  flexDirection:  'column',
  justifyContent:  'center',
  maxWidth:  '650px',
  textAlign:  'center',
  [mediaQueries.phone]: {
    maxWidth: '700px',
    margin: '0px 20px',
  },
});
