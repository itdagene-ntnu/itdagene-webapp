//@flow
import styled from 'styled-components';
import { useFragment, graphql } from 'relay-hooks';
import { ZoomImage } from '../Styled';

import React from 'react';
import ReactMarkdown from 'react-markdown';

import {
  type Collaborator_company,
  type Collaborator_company$key,
} from './__generated__/Collaborator_company.graphql';

type Props = {
  company: Object,
  showDescription?: boolean,
  showJoblistings?: boolean,
};
const Image = styled(ZoomImage)`
  width: 270px;
  height: 100px;
  max-width: calc(100% - 30px);
  object-fit: cover;
  margin: 40px auto 0 auto;
  padding: 15px;
`;

const fragmentSpec = graphql`
  fragment Collaborator_company on Company {
    id
    name
    logo(width: 459, height: 170)
    url
    description
  }
`;

const Collaborator = ({
  showDescription,
  showJoblistings,
  ...props
}: Props) => {
  const company: Collaborator_company = useFragment(
    fragmentSpec,
    (props.company: Collaborator_company$key)
  );
  return (
    <div
      style={{ flex: 1, maxWidth: '100%', flexBasis: 350, padding: '0 10px' }}
    >
      <a href={company.url}>
        <Image src={company.logo || ''} />
      </a>
      {showDescription && <ReactMarkdown source={company.description} />}
    </div>
  );
};
export default Collaborator;
