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
  ${({ noPadding = false }: { noPadding?: boolean }): any =>
    !noPadding &&
    css`
      padding: 6em 0;
      @media only screen and (max-width: 767px) {
        padding: 2em 0;
      }
    `};
`;

export const BottomBorder = styled('div')`
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Section = (props: any): JSX.Element => (
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

  ${({ text = false }: { text?: boolean }): any =>
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

export const SubHeader = styled.h3`
  margin: 0;
  font-weight: 300;
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #f1f1f1;
  flex-shrink: 0;
`;

export const PaddedDivider = styled(Divider)<{ margin?: number }>`
  background-color: #fff;
  margin: ${(props): any =>
    props.margin
      ? `${props.margin}px auto ${props.margin}px auto`
      : '30px auto 30px auto'};
`;

export const NudgeDiv = styled('div')<{ scale: number }>`
  transition: 0.1s;
  &:hover {
    transform: scale(${(props): any => props.scale});
  }
`;

export const EllipseOverflowDiv = styled.div<{
  maxLines: number;
  smallScreenMaxLines?: number;
}>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props): number => props.maxLines};
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    -webkit-line-clamp: ${(props): number =>
      props.smallScreenMaxLines ?? props.maxLines};
  }
`;
