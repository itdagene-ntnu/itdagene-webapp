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
import InfiniteScroll from 'react-infinite-scroller';
import dayjs from 'dayjs';

function joinValues(values) {
  if (values.length < 2) {
    return values[0] || '';
  }

  return (
    <span>
      {values.map((el, i) => (
        <span key={i}>
          {i > 0 && i !== values.length - 1 && ', '}
          {i === values.length - 1 && ' og '}
          {el}
        </span>
      ))}
    </span>
  );
}

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
    $orderBy: [OrderByJoblistingType]
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
        orderBy: $orderBy
      )
  }
`;

const JoblistingGrid = styled(Flex)`
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
  display: grid;
`;
const CompanyElement = styled('div')`
  cursor: pointer;
  padding: 60px 15px 15px;
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
const isCurrentYear = day => dayjs(day).year() === dayjs().year();

const ListRenderer = props => (
  <>
    {!props.root && <LoadingIndicator />}
    <InfiniteScroll
      element="div"
      hasMore={props.relay.hasMore()}
      loadMore={() => {
        if (
          props.loading ||
          !props.relay.hasMore() ||
          props.relay.isLoading()
        ) {
          return;
        }

        props.loadingStart();
        props.relay.loadMore(
          30, // Fetch the next 30 feed items
          error => {
            props.loadingEnd();
          }
        );
      }}
      threshold={50}
      loader={<LoadingIndicator hideText noMargin />}
    >
      <JoblistingGrid>
        {props.root &&
          props.root.joblistings.edges.map(({ node }) => (
            <CompanyElement key={node.id}>
              <Link key={node.id} href={`/jobb/${node.id}`}>
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
                  <div
                    style={{
                      color: 'gray',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      margin: '3px'
                    }}
                  >
                    {node.deadline
                      ? 'Frist: ' +
                        dayjs(node.deadline).format(
                          `D. MMMM ${
                            isCurrentYear(node.deadline) ? '' : 'YYYY'
                          }`
                        )
                      : 'Løpende søknadsfrist'}
                  </div>

                  <div style={{ color: 'gray', textAlign: 'center' }}>
                    {node.towns.length > 3
                      ? `${node.towns[0].name}, ${
                          node.towns[1].name
                        }, ${node.towns[2].name.slice(0, 3)}...`
                      : joinValues(node.towns.map(({ name }) => name))}
                  </div>
                </a>
              </Link>
            </CompanyElement>
          ))}

        {props.root && props.root.joblistings.edges.length === 0 && (
          <h2> Ingen annonser :( </h2>
        )}
      </JoblistingGrid>
    </InfiniteScroll>
  </>
);

export const JoblistingsList = createPaginationContainer(
  ListRenderer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 30 }
          cursor: { type: "String" }
          type: { type: "String" }
          fromYear: { type: "Float" }
          toYear: { type: "Float" }
          company: { type: "ID" }
          towns: { type: "[ID]", defaultValue: [] }
          orderBy: { type: "[OrderByJoblistingType]" }
        ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromYear: $fromYear
          toYear: $toYear
          towns: $towns
          orderBy: $orderBy
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: [
              "toYear"
              "fromYear"
              "company"
              "type"
              "towns"
              "orderBy"
            ]
          ) {
          edges {
            node {
              id
              __typename
              type
              title
              url
              deadline
              towns {
                name
              }
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
      const {
        type,
        orderBy,
        company,
        fromYear,
        toYear,
        towns
      } = fragmentVariables;
      return {
        count,
        orderBy,
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
