import React from 'react';

import { Section } from '../components/Styled';
import { Image, CenterIt } from '../components/Styled';
import { graphql } from 'react-relay';

import { pages_index_QueryResponse } from '../__generated__/pages_index_Query.graphql';
import Collaborators from '../components/Collaborators/Collaborators';
import Companies from '../components/Companies/Companies';
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

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-around;
  align-content: stretch;
  align-items: center;
`;

const Div2 = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: 700px;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
`;

const DivItem1 = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

const DivItem2 = styled('div')`
  order: 0;
  flex-basis: 400px;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
`;

const ReadMore = styled('h4')``;

const AboutSection = (props: pages_index_QueryResponse): JSX.Element => {
  const frontpage =
    props.pages && props.pages.find((el) => el && el.slug === 'frontpage');
  return (
    <>
      <Div>
        <DivItem>{frontpage && <PageView hideDate page={frontpage} />}</DivItem>
        <DivItem1>
          <CenterIt>
            <Image
              style={{ width: 350, maxWidth: '100%' }}
              src="https://cdn.itdagene.no/itdagene-svart.png"
              alt="itDAGENE logo"
            />
          </CenterIt>
        </DivItem1>
      </Div>
      <CenterIt text>
        <Link href="/om-itdagene">
          <ReadMore>Les mer</ReadMore>
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
    <Div2>
      {query.pages &&
        query.pages.filter(Boolean).map(
          (element) =>
            element && (
              <DivItem2 key={element.slug} style={{ paddingRight: '1em' }}>
                <h2>{element.title}</h2>
                <p>{element.ingress}</p>
                <Centered>
                  <Link href="/info/[side]" as={`/info/${element.slug}`}>
                    <ReadMore>Les mer</ReadMore>
                  </Link>
                </Centered>
              </DivItem2>
            )
        )}
    </Div2>
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
