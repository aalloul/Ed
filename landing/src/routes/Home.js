import React from 'react'

import HeroSection from '../containers/HeroSection/HeroSection';
import HiwSection from '../containers/HiwSection/HiwSection';
import IssuesSection from '../containers/IssuesSection/IssuesSection';
// import PricingSection from '../containers/PricingSection/PricingSection';
// import ReviewsSection from '../containers/ReviewsSection/ReviewsSection';

export default () => (
  <React.Fragment>
    <HeroSection />
    <IssuesSection />
    <HiwSection />
    { /* <PricingSection /> */ }
    { /* <ReviewsSection /> */ }
  </React.Fragment>
);
