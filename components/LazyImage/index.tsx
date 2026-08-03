import { Skeleton } from '@mui/material';
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
  cursor: ${(props): string => props.$cursor || 'default'};
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(${(props): string => (props.$hover ? '1.025' : '1')});
    z-index: 99;
  }
`;

const ImageFrame = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--color-surface-muted);
`;

const ImageError = styled.span`
  position: absolute;
  display: grid;
  padding: var(--space-4);
  color: var(--color-ink-muted);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  inset: 0;
  place-items: center;
  text-align: center;
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
    <ImageFrame style={{ width, height }}>
      {loading && !error && (
        <Skeleton
          variant={skeletonVariant}
          animation="wave"
          width={width}
          height={height}
          style={{ position: 'absolute' }}
        />
      )}
      {error ? (
        <ImageError aria-hidden="true">Bildet kunne ikke lastes</ImageError>
      ) : (
        <StyledImage
          $hover={hover}
          $cursor={cursor}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(): void => setLoading(false)}
          onError={(): void => {
            setError(true);
            setLoading(false);
          }}
          onClick={onClick}
          width={width}
          height={height}
          quality={100}
        />
      )}
    </ImageFrame>
  );
};

export default LazyImage;
