import Link from 'next/link';
import React from 'react';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import Collaborators from '../components/Collaborators/Collaborators';
import MainCollaborator from '../components/Collaborators/MainCollaborator';
import CompactProgram from '../components/CompactProgram';
import Companies from '../components/Companies/Companies';
import Interest from '../components/Frontpage/Interest';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import { Section } from '../components/Styled';
import Flex from '../components/Styled/Flex';
import FlexItem from '../components/Styled/FlexItem';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { pages_index_QueryResponse } from '../__generated__/pages_index_Query.graphql';

type RenderProps = WithDataAndLayoutProps<pages_index_QueryResponse>;

const ReadMore = styled('h4')``;

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

export default withDataAndLayout(Index, {
  query: graphql`
    query pages_index_Query($slugs: [String!]!) {
      currentMetaData {
        ...Year_currentMetaData
        ...WelcomeScreen_currentMetaData
        id
        interestForm
        collaborators {
          id
        }
        companiesFirstDay {
          id
        }
        companiesLastDay {
          id
        }
        mainCollaborator {
          id
          ...MainCollaborator_company
        }
        ...Companies_query
        ...Collaborators_query
      }

      pages(slugs: $slugs) {
        ...PageView_page
        title
        slug
        ingress
      }
    }
  `,
  variables: {
    slugs: [
      //TODO: Remove this when we have this year's pages
      'frontpage',
      'bankett-copy',
      'sommerjobbmaraton-copy',
      'stands-copy',
      'kurs-copy',
      'om-itdagene',
      'stands',
    ],
  },
});
