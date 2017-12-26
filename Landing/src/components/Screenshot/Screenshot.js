import glamorous from 'glamorous';

export default glamorous.div({
  height: '650px',
  minWidth: '350px',
  position: 'relative',
  width: '350px',
  ':before': {
    content: '""',
    position: 'absolute',
  },
  ':after': {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    content: '""',
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    width: '100%',
  },
}, ({ type }) => ({
  success: {
    ':before': {
      background: 'url("/img/4-Success.jpg") 0 78px no-repeat',
      backgroundSize: 'contain',
      height: '100%',
      left: '20px',
      top: '20px',
      width: '82%',
    },
    ':after': {
      backgroundImage: 'url("/img/Apple iPhone 8 Space Grey.jpg")',
    }
  },
  scan: {
    ':before': {
      background: 'url("/img/1-Scan.png") -34px -50px no-repeat',
      height: '83%',
      left: '18px',
      top: '57px',
      width: '75%',
    },
    ':after': {
      backgroundImage: 'url("/img/Samsung Galaxy S8 Midnight Black.jpg")',
    }
  },
  translation: {
    ':before': {
      background: '#fff url("/img/2-Translation.jpg") 0 0 no-repeat',
      backgroundSize: 'contain',
      height: '80%',
      left: '24px',
      top: '97px',
      width: '79%',
    },
    ':after': {
      backgroundImage: 'url("/img/Apple iPhone 8 Space Grey.jpg")',
    }
  },
  email: {
    ':before': {
      background: 'url("/img/3-Email.jpg") -34px -50px no-repeat',
      height: '80%',
      left: '7px',
      top: '80px',
      width: '83%',
    },
    ':after': {
      backgroundImage: 'url("/img/Google Pixel 2 Just Black.png")',
    }
  },
}[type]));
