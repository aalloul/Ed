import glamorous from 'glamorous';

import consts from '../../common/consts';

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
    [consts.media.phone]: {
      display: 'none',
      top: '-150px',
    },
  },
  [consts.media.phone]: {
    position: 'absolute',
    margin: '0px auto',
  },
}, ({ type }) => ({
  success: {
    ':before': {
      background: 'url("/img/4-Success.jpg") center center no-repeat',
      backgroundSize: '90%',
      height: '71%',
      left: '20px',
      top: '94px',
      width: '82%',
    },
    ':after': {
      backgroundImage: 'url("/img/Apple iPhone 8 Space Grey.png")',
    },
    [consts.media.phone]: {
      display: 'none',
    },
  },
  scan: {
    ':before': {
      background: 'url("/img/1-Scan.png") center -50px no-repeat',
      height: '83%',
      left: '18px',
      top: '57px',
      width: '75%',
      [consts.media.phone]: {
        height: '80%',
        width: '90%',
        top: '-50px',
        left: '18px',
      },
    },
    ':after': {
      backgroundImage: 'url("/img/Samsung Galaxy S8 Midnight Black.png")',
    }
  },
  translation: {
    ':before': {
      background: '#fff url("/img/2-Translation.jpg") center center no-repeat',
      backgroundSize: 'contain',
      height: '71%',
      left: '24px',
      top: '97px',
      width: '79%',
      [consts.media.phone]: {
        height: '80%',
        width: '90%',
        top: '-100px',
        left: '18px',
      },
    },
    ':after': {
      backgroundImage: 'url("/img/Apple iPhone 8 Space Grey.png")',
    }
  },
  email: {
    ':before': {
      background: 'url("/img/3-Email.jpg") 15px 5px no-repeat',
      backgroundSize: 'contain',
      height: '75%',
      left: '8px',
      top: '80px',
      width: '85%',
      [consts.media.phone]: {
        height: '80%',
        width: '90%',
        top: '-80px',
        left: '18px',
      },
    },
    ':after': {
      backgroundImage: 'url("/img/Google Pixel 2 Just Black.png")',
    }
  },
}[type]));
