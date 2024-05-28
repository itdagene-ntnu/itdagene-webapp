'use client'

import React from 'react';

import { Section } from '../components/Styled';

import { pages_index_QueryResponse } from '../__generated__/pages_index_Query.graphql';
import Collaborators from '../components/Collaborators/Collaborators';
import Companies from '../components/Companies/Companies';
import Link from 'next/link';
import styled from 'styled-components';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import Interest from '../components/Frontpage/Interest';
import { WithDataAndLayoutProps } from '../lib/withData';
import PageView from '../components/PageView';
import CompactProgram from '../components/CompactProgram';
import MainCollaborator from '../components/Collaborators/MainCollaborator';
import FlexItem from '../components/Styled/FlexItem';
import Flex from '../components/Styled/Flex';
import { Player } from 'video-react';

type RenderProps = WithDataAndLayoutProps<pages_index_QueryResponse>;

const ReadMore = styled('h4')``;

const CustomPlayer = styled.div`
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

const AboutSection = (props: pages_index_QueryResponse): JSX.Element => {
  const frontpage =
    props.pages && props.pages.find((el) => el && el.slug === 'frontpage');
  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection="row"
        style={{ alignItems: 'center', gap: '2em' }}
      >
        <FlexItem flexBasis="700px" flexGrow="1">
          {frontpage && <PageView hideDate page={frontpage} />}
        </FlexItem>

        <CustomPlayer>
          <Player
            playsInline
            src={'https://cdn.itdagene.no/it.mp4'}
            fluid={false}
            width={280}
            height={500}
          />
        </CustomPlayer>
      </Flex>
    </>
  );
};

const Centered = styled('div')`
  text-align: center;
`;

const EventsSection = ({
  query,
}: {
  query: pages_index_QueryResponse;
}): JSX.Element => (
  <>
    <Flex flexWrap="wrap">
      {query.pages &&
        query.pages.filter(Boolean).map(
          (element) =>
            element && (
              <FlexItem
                flexBasis="400px"
                flexGrow="1"
                key={element.slug}
                style={{ paddingRight: '1em' }}
              >
                <h2>{element.title}</h2>
                <p>{element.ingress}</p>
                <Centered>
                  <Link href="/info/[side]" as={`/info/${element.slug}`}>
                    <ReadMore>Les mer</ReadMore>
                  </Link>
                </Centered>
              </FlexItem>
            )
        )}
    </Flex>
  </>
);

const Index = ({ props, error }: RenderProps): JSX.Element => (
  <>
    <WelcomeScreen currentMetaData={props.currentMetaData} />
    <Section>
      <AboutSection {...props} />
    </Section>
    {props.currentMetaData.interestForm && (
      <Section>
        <Interest form={props.currentMetaData.interestForm} />
      </Section>
    )}
    <Section>
      <CompactProgram />
    </Section>
    {props.currentMetaData.mainCollaborator?.id && (
      <Section>
        <MainCollaborator company={props.currentMetaData.mainCollaborator} />
      </Section>
    )}
    {props.currentMetaData.collaborators && (
      <Section>
        <Collaborators showDescription query={props.currentMetaData} />
      </Section>
    )}
    {(props.currentMetaData.companiesFirstDay ||
      props.currentMetaData.companiesLastDay) && (
      <Section>
        <Companies query={props.currentMetaData} />
      </Section>
    )}
    <Section style={{ borderBottom: 0 }}>
      <EventsSection query={props} />
    </Section>
  </>
);

export default Index;