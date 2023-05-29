import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { ZoomImage } from '../Styled';
import styled from 'styled-components';
import { CompanyView_company } from '../../__generated__/CompanyView_company.graphql';

type Props = {
  company: CompanyView_company;
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

const CompanyView = ({ company }: Props): JSX.Element | null =>
  company.logo ? (
    <a href={company.url || undefined} target="_blank" rel="noreferrer">
      <Image src={company.logo || ''} />
    </a>
  ) : null;

export default createFragmentContainer(CompanyView, {
  company: graphql`
    fragment CompanyView_company on Company {
      id
      name
      logo(width: 240, height: 200)
      name
      url
    }
  `,
});
