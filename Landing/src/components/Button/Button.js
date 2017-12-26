import glamorous from 'glamorous';
import consts from '../consts';

export default glamorous.a({
  fontSize: '30px',
  textDecoration: 'none',
  lineHeight: '78px',
  height: '78px',
  display: 'inline-block',
  background: consts.mainColor,
  borderRadius: '5px',
  padding: '0 30px',
  boxShadow: '0 20px 55px rgba(0, 0, 0, 0.33)',
  color: '#fff',
  textAlign: 'left',
  ':hover': {
    background: '#1efcd0',
    color: '#171838',
    textDecoration: 'none',
  }
});