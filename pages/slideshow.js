//@flow

import React from 'react';

import { Carousel } from 'react-responsive-carousel';

const slideImages = [
  'https://cdn.itdagene.no/bedrifter1.png',
  'https://cdn.itdagene.no/bedrifter2.png',
  'https://cdn.itdagene.no/program-bredt.svg',
  'https://cdn.itdagene.no/standkart-bredt.svg'
];

const Index = () => (
  <Carousel
    showArrows={false}
    showIndicators={false}
    showThumbs={false}
    infiniteLoop={true}
    autoPlay={true}
    stopOnHover={false}
    interval={20000}
    transitionTime={1000}
  >
    <img alt={slideImages[0]} src={slideImages[0]} />
    <img alt={slideImages[1]} src={slideImages[1]} />
    <img alt={slideImages[2]} src={slideImages[2]} />
    <img alt={slideImages[3]} src={slideImages[3]} />
  </Carousel>
);

export default Index;
