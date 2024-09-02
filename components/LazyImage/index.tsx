import { Skeleton, SkeletonTypeMap } from '@mui/material';
import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledImage = styled(Image)<{
  $hover: boolean;
  $cursor: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
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
  skeletonVariant?: 'text' | 'rectangular' | 'rounded' | 'circular' | undefined;
  hover?: boolean;
  cursor?: string;
  src: string;
  alt: string;
  onClick?: () => void;
};

/**
 * Primarily designed for the Gallery,
 * you might need to update styling if used elsewhere
 */
const LazyImage = ({
  skeletonVariant = 'rectangular',
  hover = false,
  cursor = 'default',
  src,
  alt,
  onClick,
  width,
  height,
}: LazyImageProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  return (
    <>
      <div
        style={{
          width: width,
          height: height,
          display: error ? 'none' : 'block',
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
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(): void => setLoading(false)}
          onError={(): void => setError(true)}
          onClick={onClick}
          width={width}
          height={height}
          quality={100}
        />
      </div>
    </>
  );
};

export default LazyImage;
