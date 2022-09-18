import React from 'react';

import { Section } from '../components/Styled';
import { Image, CenterIt } from '../components/Styled';
import { graphql } from 'react-relay';

import { pages_index_QueryResponse } from '../__generated__/pages_index_Query.graphql';
import Collaborators from '../components/Collaborators/Collaborators';
import Companies from '../components/Companies/Companies';
import Flex, { FlexItem } from 'styled-flex-component';
import Link from 'next/link';
import styled from 'styled-components';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import Interest from '../components/Frontpage/Interest';
import RunForMe from '../components/Frontpage/RunForMe';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import PageView from '../components/PageView';
import CompactProgram from '../components/CompactProgram';
import MainCollaborator from '../components/Collaborators/MainCollaborator';

type RenderProps = WithDataAndLayoutProps<pages_index_QueryResponse>;

const ReadMore = styled('h4')``;

const AboutSection = (props: pages_index_QueryResponse): JSX.Element => {
  const frontpage =
    props.pages && props.pages.find((el) => el && el.slug === 'frontpage');
  return (
    <>
      <Flex justifyAround wrapReverse alignCenter>
        <FlexItem grow={1} basis="700px">
          {frontpage && <PageView hideDate page={frontpage} />}
        </FlexItem>
        <FlexItem>
          <CenterIt>
            <Image
              style={{ width: 350, maxWidth: '100%' }}
              src="https://cdn.itdagene.no/itdagene-svart.png"
              alt="itDAGENE logo"
            />
          </CenterIt>
        </FlexItem>
      </Flex>
      <CenterIt text>
        <Link href="/om-itdagene">
          <a>
            <ReadMore>Les mer</ReadMore>
          </a>
        </Link>
      </CenterIt>
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
    <Flex wrap>
      {query.pages &&
        query.pages.filter(Boolean).map(
          (element) =>
            element && (
              <FlexItem
                key={element.slug}
                basis={'400px'}
                grow={1}
                style={{ paddingRight: '1em' }}
              >
                <h2> {element.title} </h2>
                <p>{element.ingress}</p>
                <Centered>
                  <Link href="/info/[side]" as={`/info/${element.slug}`}>
                    <a>
                      <ReadMore>Les mer</ReadMore>
                    </a>
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
    {props.currentMetaData.mainCollaborator && (
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
    <Section>
      <RunForMe />
    </Section>
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
      'frontpage',
      'bankett',
      'sommerjobbmaraton',
      'stands',
      'kurs',
      'om-itdagene',
    ],
  },
});
