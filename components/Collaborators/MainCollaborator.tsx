import { useFragment, graphql } from 'relay-hooks';
import { ZoomImage, CenterIt } from '../Styled';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { Player } from 'video-react';

import React from 'react';
import ReactMarkdown from 'react-markdown';

import {
  MainCollaborator_company,
  MainCollaborator_company$key,
} from '../../__generated__/MainCollaborator_company.graphql';

type Props = {
  company: MainCollaborator_company$key;
  showDescription?: boolean;
};

const Image = styled(ZoomImage)`
  width: 270px;
  height: 100px;
  max-width: calc(100% - 30px);
  object-fit: cover;
  margin: 40px auto 0 auto;
  padding: 15px;
`;

const Title = styled('h1')`
  @media only screen and (max-width: 767px) {
    font-size: 1.5em;
  }
`;

const fragmentSpec = graphql`
  fragment MainCollaborator_company on Company {
    id
    name
    logo(width: 270, height: 100)
    url
    description
    keyInformation {
      name
      value
    }
  }
`;

const HSPLogo = styled(Image)`
  width: 450px;
  max-width: 100%;
  margin-top: 10px;
`;

const MainCollaborator = ({
  showDescription,
  ...props
}: Props): JSX.Element => {
  const company: MainCollaborator_company = useFragment(
    fragmentSpec,
    props.company
  );

  // Somewhat hacky, but should do the trick without adding a bunch of fields etc.
  const poster = company.keyInformation?.find(
    (keyInfo) => keyInfo.name === 'hsp-poster'
  );
  const video = company.keyInformation?.find(
    (keyInfo) => keyInfo.name === 'hsp-video'
  );
  const intro = company.keyInformation?.find(
    (keyInfo) => keyInfo.name === 'hsp-intro'
  );

  return (
    <Flex justifyAround column>
      <FlexItem>
        <CenterIt text>
          <Title>Hovedsamarbeidspartner</Title>
        </CenterIt>
      </FlexItem>
      <FlexItem>
        <FlexItem>
          <a href={company.url || ''}>
            <HSPLogo src={company.logo || ''} alt="Logo" />
          </a>
        </FlexItem>
        <CenterIt text>
          <p>
            <b>
              Vi er stolte av å kunne presentere {company.name} som
              hovedsamarbeidspartner!
            </b>
          </p>

          {showDescription && <ReactMarkdown source={company.description} />}

          <h3>{intro?.value || 'Missing hsp-intro'}</h3>
          <h3>↓ Ta en titt på denne filmen ↓</h3>

          {video ? (
            <Player playsInline poster={poster?.value} src={video?.value} />
          ) : (
            'Missing hsp-video'
          )}
        </CenterIt>
      </FlexItem>
    </Flex>
  );
};

export default MainCollaborator;
