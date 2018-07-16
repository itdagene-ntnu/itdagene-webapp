//@flow

import React from 'react';
import styled, { css } from 'styled-components';

export const ResponsiveContent = styled('div')`
  @media only screen and (min-width: 1200px) {
    width: 1127px;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  @media only screen and (max-width: 1199px) and (min-width: 992px) {
    width: 933px;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  @media only screen and (max-width: 991px) and (min-width: 768px) {
    width: 723px;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  @media only screen and (max-width: 767px) {
    width: auto !important;
    margin-left: 1em !important;
    margin-right: 1em !important;
  }
`;

export const BorderlessSection = styled(ResponsiveContent)`
  margin: 0;
  background: none transparent;
  border-radius: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  padding: 6em 0em;
`;

export const BottomBorder = styled('div')`
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Section = (props: any) => (
  <BottomBorder>
    <BorderlessSection {...props} />
  </BottomBorder>
);

export const Image = styled('img')`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const ZoomImage = styled(Image)`
  transition: transform 0.4s; /* Animation */
  :hover {
    transform: scale(1.2);
  }
`;

export const CenterIt = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  ${({ text = false }: { text?: boolean }) =>
    text &&
    css`
      align-items: center;
      text-align: center;
    `};
`;

export const NoBulletUl = styled('ul')`
  list-style-type: none;
  -moz-padding-start: 0px;
  -webkit-padding-start: 0px;
`;
