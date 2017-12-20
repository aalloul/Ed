import React from 'react';
import PropTypes from 'prop-types';

import Buttons from '../Buttons/Buttons';

const HiwStep = ({ number, title, beforeContent, afterContent, children }) => (
  <div className="hiw-step">
    {beforeContent}

    <div className="main hiw-step--content">
      <h3 className="hiw-step--title">
        <span className="hiw-step--number">{number}</span>
        {title}
      </h3>
      <p className="hiw-step--text">
        {children}
      </p>

      <Buttons />
    </div>

    {afterContent}
  </div>
);

HiwStep.displayName = 'HiwStep';

HiwStep.propTypes = {
  number: PropTypes.string,
  title: PropTypes.string,
  test: PropTypes.string,
  beforeContent: PropTypes.element,
  afterContent: PropTypes.element,
  children: PropTypes.any,
};

export default HiwStep;