import { useFragment, graphql } from 'relay-hooks';
import { ZoomImage, CenterIt } from '../Styled';
import styled from 'styled-components';
import { Player } from 'video-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  MainCollaborator_company,
  MainCollaborator_company$key,
} from '../../__generated__/MainCollaborator_company.graphql';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

type Props = {
  company: MainCollaborator_company$key;
  showDescription?: boolean;
};

const Image = styled(ZoomImage)`
  width: 270px;
  height: 103px;
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
  fragment MainCollaborator_company on MainCollaborator {
    id
    name
    logo(width: 1000, height: 1000)
    url
    description
    video
    poster
    intro
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

  return (
    <Flex flexDirection="column" justifyContent="space-around">
      <FlexItem>
        <CenterIt text>
          <Title>Vår hovedsamarbeidspartner</Title>
        </CenterIt>
      </FlexItem>
      <FlexItem>
        <FlexItem>
          <a href={company.url || ''} target="_blank" rel="noreferrer">
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

          {company.intro && <ReactMarkdown source={company.intro} />}

          <h3>
            ↓ Ta en titt på hvordan sommerjobb i {company.name} kan se ut ↓
          </h3>

          {company.video ? (
            <Player playsInline poster={company.logo} src={company.video} />
          ) : (
            'Missing main collaborator video!'
          )}
        </CenterIt>
      </FlexItem>
    </Flex>
  );
};

export default MainCollaborator;
