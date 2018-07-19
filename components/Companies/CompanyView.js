//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { ZoomImage } from '../Styled';
import styled from 'styled-components';
import { type CompanyView_company } from './__generated__/CompanyView_company.graphql';

type Props = {
  company: CompanyView_company
};
const Image = styled(ZoomImage)`
  width: 156px;
  height: 130px;
  margin-left: auto;
  margin-right: auto;
  padding: 14px;
  @media only screen and (max-width: 767px) {
    width: 120px;
    height: 100px;
    padding: 7px;
  }
`;

const CompanyView = ({ company }: Props) =>
  company.logo ? (
    <a href={company.url}>
      <Image src={company.logo || ''} />
    </a>
  ) : null;

export default createFragmentContainer(
  CompanyView,
  graphql`
    fragment CompanyView_company on Company {
      id
      name
      # Keep this image with an aspect ratio of 5/6. So not squared
      logo(width: 240, height: 200)
      name
      url
    }
  `
);
