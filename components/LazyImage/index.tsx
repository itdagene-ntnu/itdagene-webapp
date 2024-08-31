import { Skeleton } from '@mui/material';
import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledImage = styled(Image)<{
  $hover: boolean;
  $cursor: string;
}>`
  object-fit: cover;
  cursor: ${(props) => props.$cursor || 'default'};
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(${(props) => (props.$hover ? '1.025' : '1')});
    z-index: 99;
  }
`;

type LazyImageProps = ImageProps & {
  skeletonVariant?: string;
  hover?: boolean;
  cursor?: string;
};

/**
 * Primarily designed for the Gallery,
 * you might need to update styling if used elsewhere
 */
const LazyImage = ({
  skeletonVariant = 'reactangular',
  hover = false,
  cursor = 'default',
  width,
  height,
  ...props
}: LazyImageProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <div
        style={{
          width: width,
          height: height,
        }}
      >
        {loading && (
          <Skeleton
            variant={skeletonVariant}
            animation="wave"
            width={width}
            height={height}
            style={{ position: 'absolute' }}
          />
        )}
        <StyledImage
          $hover={hover}
          $cursor={cursor}
          loading="lazy"
          onLoad={(): void => setLoading(false)}
          width={width}
          height={height}
          quality={100}
          {...props}
        />
      </div>
    </>
  );
};

export default LazyImage;
