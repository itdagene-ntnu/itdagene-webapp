import {
  createPaginationContainer,
  graphql,
  type Variables
} from 'react-relay';
import { Image } from '../Styled';
import Link from 'next/link';
import * as React from 'react';
import 'rc-slider/assets/index.css';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import type { JoblistingsContainer_root } from './__generated__/JoblistingsContainer_root.graphql';
import LoadingIndicator from '../LoadingIndicator';
import Sidebar, { jobTypeOptions } from './JoblistingsSidebar';

const CompanyImage = styled(Image)`
  width: 95%;
  max-width: 232px;
  object-fit: contain;
  margin: 20px auto 15px auto;
  @media only screen and (max-width: 767px) {
    max-width: none;
  }
`;

export const query = graphql`
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $fromYear: Float
    $toYear: Float
    $company: ID
    $towns: [ID]
  ) {
    ...JoblistingsContainer_root
      @arguments(
        count: $count
        cursor: $cursor
        type: $type
        company: $company
        fromYear: $fromYear
        toYear: $toYear
        towns: $towns
      )
  }
`;

const JoblistingGrid = styled(Flex)`
  width: 100%;
  flex-wrap: wrap;
  @media only screen and (max-width: 767px) {
    justify-content: center;
  }
`;
const CompanyElement = styled('div')`
  flex-grow: 1;
  cursor: pointer;
  flex-basis: 239px;
  max-width: 239px;
  padding: 60px 15px 15px 15px;
  @media only screen and (max-width: 767px) {
    max-width: none;
  }
`;

type Props = {
  root: JoblistingsContainer_root,
  variables: Variables,
  loading: boolean,
  loadingEnd: () => void,
  loadingStart: () => void
};

const ListRenderer = props => (
  <>
    <JoblistingGrid>
      {props.root &&
        props.root.joblistings.edges.map(({ node }) => (
          <CompanyElement key={node.id}>
            <Link
              key={node.id}
              href={{
                pathname: '/jobbannonse',
                query: { id: node.id }
              }}
            >
              <a>
                <CompanyImage
                  src={node.company.logo || '/static/itdagene-gray.png'}
                />
                <h3
                  style={{
                    fontWeight: 'normal',
                    fontSize: 20,
                    lineHeight: '24px',
                    color: 'black',
                    // minHeight: 48,
                    margin: '5px 0',
                    textAlign: 'center'
                  }}
                >
                  {node.title}
                </h3>
                <div style={{ color: 'gray', textAlign: 'center' }}>
                  {
                    jobTypeOptions.find(
                      el => el.value === node.type.toLowerCase()
                    ).label
                  }{' '}
                  @ {node.company.name}
                </div>
              </a>
            </Link>
          </CompanyElement>
        ))}

      {props.root &&
        props.root.joblistings.edges.length === 0 && (
          <h2> Fant ingen annonser med søket ditt :( </h2>
        )}
    </JoblistingGrid>
    {props.loading && <LoadingIndicator hideText noMargin />}
    {!props.root && <LoadingIndicator />}
    {props.relay.hasMore() &&
      !props.loading && (
        <h3 style={{ textAlign: 'center' }}>
          <a
            href="/#"
            onClick={e => {
              if (!props.relay.hasMore() || props.relay.isLoading()) {
                return;
              }

              props.loadingStart();
              props.relay.loadMore(
                9, // Fetch the next 9 feed items
                error => {
                  props.loadingEnd();
                }
              );
              e.preventDefault();
            }}
          >
            Hent flere
          </a>
        </h3>
      )}
  </>
);

export const JoblistingsList = createPaginationContainer(
  ListRenderer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 9 }
          cursor: { type: "String" }
          type: { type: "String" }
          fromYear: { type: "Float" }
          toYear: { type: "Float" }
          company: { type: "ID" }
          towns: { type: "[ID]", defaultValue: [] }
        ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromYear: $fromYear
          toYear: $toYear
          towns: $towns
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: ["toYear", "fromYear", "company", "type", "towns"]
          ) {
          edges {
            node {
              id
              __typename
              type
              title
              url
              company {
                name
                logo(width: 800, height: 260)
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.root && props.root.joblistings;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { cursor, count }, fragmentVariables) {
      const { type, company, fromYear, toYear, towns } = fragmentVariables;
      return {
        count,
        fromYear,
        toYear,
        cursor,
        type,
        company,
        towns
      };
    },
    query
  }
);

const JoblistingsContainer = ({ environment, variables, children }: Props) => (
  <div>
    <h1> Jobbannonser </h1>
    <Flex wrapReverse>
      <FlexItem center basis="700px" grow={26}>
        {children}
      </FlexItem>
      <FlexItem basis="300px" grow={1}>
        <Sidebar environment={environment} variables={variables} />
      </FlexItem>
    </Flex>
  </div>
);

export default JoblistingsContainer;
