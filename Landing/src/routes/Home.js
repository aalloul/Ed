import React from 'react'

import HeroSection from '../containers/HeroSection/HeroSection';
import HiwSection from '../containers/HiwSection/HiwSection';
import PricingSection from '../containers/PricingSection/PricingSection';
import ReviewsSection from '../containers/ReviewsSection/ReviewsSection';

export default () => (
  <React.Fragment>
    <HeroSection />
    <HiwSection />
    <PricingSection />
    <ReviewsSection />
  </React.Fragment>
);
