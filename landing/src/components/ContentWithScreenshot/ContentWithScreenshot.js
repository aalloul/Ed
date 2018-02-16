import glamorous from 'glamorous';

import consts from '../../common/consts';

export default glamorous.div({
  alignItems:  'center',
  display:  'flex',
  flexDirection:  'column',
  justifyContent:  'center',
  maxWidth:  '650px',
  textAlign:  'center',
  [consts.media.phone]: {
    maxWidth: '700px',
    margin: '0px 20px',
  },
});
